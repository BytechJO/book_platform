const multer = require("multer");
const path = require("path");

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
]);

const allowedExtensions = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".jpg", ".jpeg", ".png", ".webp", ".txt", ".zip",
]);

const resourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
      return callback(null, true);
    }
    callback(new Error("Unsupported resource file type"));
  },
});

const uploadResourceFile = (req, res, next) => {
  resourceUpload.single("file")(req, res, (error) => {
    if (!error) return next();

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Resource file must be 20MB or smaller"
        : error.message || "Could not upload resource file";
    return res.status(400).json({ message });
  });
};

module.exports = uploadResourceFile;
