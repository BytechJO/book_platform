const pool = require("../database/connection");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const path = require("path");
const { randomUUID } = require("crypto");
const { Readable } = require("stream");
const logActivity = require("../utils/activityLogger");

const RESOURCE_TYPES = new Set(["file", "worksheet", "video", "link"]);
const FILE_TYPES = new Set(["file", "worksheet"]);

const uploadToCloudinary = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const baseName = path
    .basename(file.originalname, extension)
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "resource";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "class-resources",
        resource_type: "raw",
        public_id: `${baseName}-${randomUUID()}${extension}`,
        filename_override: file.originalname,
      },
      (error, result) => (result ? resolve(result) : reject(error)),
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const deleteCloudinaryFile = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (error) {
    console.error("Delete resource file from Cloudinary error:", error);
  }
};

const findTeacherClass = async (classId, teacherId) => {
  const result = await pool.query(
    `SELECT id, book_id FROM classes WHERE id = $1 AND teacher_id = $2`,
    [classId, teacherId],
  );
  return result.rows[0];
};

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeInput = (req) => ({
  resourceType: String(req.body.resource_type || "").trim().toLowerCase(),
  title: String(req.body.title || "").trim(),
  description: String(req.body.description || "").trim() || null,
  resourceUrl: String(req.body.resource_url || "").trim(),
});

const validateInput = ({ resourceType, title, resourceUrl }, file, existing) => {
  if (!RESOURCE_TYPES.has(resourceType)) return "Invalid resource type";
  if (!title) return "Resource title is required";
  if (title.length > 255) return "Resource title must be 255 characters or fewer";

  if (FILE_TYPES.has(resourceType)) {
    const canKeepExistingFile =
      existing && FILE_TYPES.has(existing.resource_type) && existing.resource_url;
    if (!file && !canKeepExistingFile) return "A resource file is required";
  } else if (!isValidUrl(resourceUrl)) {
    return "A valid http or https URL is required";
  } else if (resourceUrl.length > 1000) {
    return "Resource URL is too long";
  }

  return null;
};

const createClassResource = async (req, res) => {
  let uploaded = null;
  try {
    const classData = await findTeacherClass(req.params.classId, req.user.id);
    if (!classData) return res.status(404).json({ message: "Class not found" });

    const input = normalizeInput(req);
    const validationError = validateInput(input, req.file, null);
    if (validationError) return res.status(400).json({ message: validationError });

    if (FILE_TYPES.has(input.resourceType)) {
      uploaded = await uploadToCloudinary(req.file);
    }

    const result = await pool.query(
      `INSERT INTO class_resources (
         class_id, teacher_id, resource_type, title, description,
         resource_url, file_public_id, original_file_name, mime_type, file_size
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        classData.id,
        req.user.id,
        input.resourceType,
        input.title,
        input.description,
        uploaded?.secure_url || input.resourceUrl,
        uploaded?.public_id || null,
        req.file?.originalname?.slice(0, 500) || null,
        req.file?.mimetype?.slice(0, 150) || null,
        req.file?.size || null,
      ],
    );

    await logActivity({
      type: "resource",
      action: "created",
      title: "New class resource",
      description: input.title,
      actor_id: req.user.id,
      actor_role: req.user.role,
      class_id: classData.id,
      book_id: classData.book_id,
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (uploaded?.public_id) await deleteCloudinaryFile(uploaded.public_id);
    console.error("Create class resource error:", error);
    res.status(500).json({ message: "Could not create class resource" });
  }
};

const updateClassResource = async (req, res) => {
  let uploaded = null;
  try {
    const existingResult = await pool.query(
      `SELECT r.*, c.book_id
         FROM class_resources r
         JOIN classes c ON c.id = r.class_id
        WHERE r.id = $1 AND r.class_id = $2
          AND r.teacher_id = $3 AND c.teacher_id = $3`,
      [req.params.resourceId, req.params.classId, req.user.id],
    );
    const existing = existingResult.rows[0];
    if (!existing) return res.status(404).json({ message: "Resource not found" });

    const input = normalizeInput(req);
    const validationError = validateInput(input, req.file, existing);
    if (validationError) return res.status(400).json({ message: validationError });

    if (req.file && FILE_TYPES.has(input.resourceType)) {
      uploaded = await uploadToCloudinary(req.file);
    }

    const keepExistingFile =
      FILE_TYPES.has(input.resourceType) && !uploaded &&
      FILE_TYPES.has(existing.resource_type);
    const resourceUrl = keepExistingFile
      ? existing.resource_url
      : uploaded?.secure_url || input.resourceUrl;
    const publicId = keepExistingFile
      ? existing.file_public_id
      : uploaded?.public_id || null;

    const result = await pool.query(
      `UPDATE class_resources
          SET resource_type = $1, title = $2, description = $3,
              resource_url = $4, file_public_id = $5,
              original_file_name = $6, mime_type = $7, file_size = $8
        WHERE id = $9 AND class_id = $10 AND teacher_id = $11
        RETURNING *`,
      [
        input.resourceType,
        input.title,
        input.description,
        resourceUrl,
        publicId,
        keepExistingFile
          ? existing.original_file_name
          : req.file?.originalname?.slice(0, 500) || null,
        keepExistingFile
          ? existing.mime_type
          : req.file?.mimetype?.slice(0, 150) || null,
        keepExistingFile ? existing.file_size : req.file?.size || null,
        existing.id,
        existing.class_id,
        req.user.id,
      ],
    );

    if (existing.file_public_id && existing.file_public_id !== publicId) {
      await deleteCloudinaryFile(existing.file_public_id);
    }
    res.json(result.rows[0]);
  } catch (error) {
    if (uploaded?.public_id) await deleteCloudinaryFile(uploaded.public_id);
    console.error("Update class resource error:", error);
    res.status(500).json({ message: "Could not update class resource" });
  }
};

const deleteClassResource = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM class_resources r USING classes c
        WHERE r.id = $1 AND r.class_id = $2 AND r.teacher_id = $3
          AND c.id = r.class_id AND c.teacher_id = $3
        RETURNING r.file_public_id`,
      [req.params.resourceId, req.params.classId, req.user.id],
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Resource not found" });

    await deleteCloudinaryFile(result.rows[0].file_public_id);
    res.json({ message: "Resource deleted" });
  } catch (error) {
    console.error("Delete class resource error:", error);
    res.status(500).json({ message: "Could not delete class resource" });
  }
};

const downloadClassResource = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.resource_url, r.original_file_name, r.mime_type, r.file_size
         FROM class_resources r
         JOIN classes c ON c.id = r.class_id
        WHERE r.id = $1
          AND r.resource_type IN ('file', 'worksheet')
          AND (
            ($2 = 'teacher' AND c.teacher_id = $3)
            OR
            ($2 = 'student' AND EXISTS (
              SELECT 1 FROM class_students cs
               WHERE cs.class_id = r.class_id AND cs.student_id = $3
            ))
          )`,
      [req.params.resourceId, req.user.role, req.user.id],
    );

    const resource = result.rows[0];
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const fileUrl = new URL(resource.resource_url);
    if (fileUrl.protocol !== "https:" || fileUrl.hostname !== "res.cloudinary.com") {
      return res.status(400).json({ message: "Invalid resource file URL" });
    }

    const remoteResponse = await fetch(fileUrl);
    if (!remoteResponse.ok || !remoteResponse.body) {
      return res.status(502).json({ message: "Could not download resource file" });
    }

    const originalName = path.basename(
      resource.original_file_name || `resource-${resource.id}`,
    );
    const asciiName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const encodedName = encodeURIComponent(originalName).replace(/'/g, "%27");

    res.setHeader(
      "Content-Type",
      resource.mime_type || remoteResponse.headers.get("content-type") || "application/octet-stream",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
    );
    if (resource.file_size) {
      res.setHeader("Content-Length", String(resource.file_size));
    }

    Readable.fromWeb(remoteResponse.body).pipe(res);
  } catch (error) {
    console.error("Download class resource error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Could not download resource file" });
    }
  }
};

module.exports = {
  createClassResource,
  updateClassResource,
  deleteClassResource,
  downloadClassResource,
};
