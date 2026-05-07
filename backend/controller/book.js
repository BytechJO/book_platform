const pool = require("../database/connection");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const logActivity = require("../utils/activityLogger");
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,
      app_store_url,
      google_play_url,
      online_book_url,
      category_id,
    } = req.body;

    // ✅ تحقق من الاسم
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const existingBook = await pool.query(
      "SELECT id FROM books WHERE LOWER(title) = LOWER($1)",
      [title.trim()],
    );

    if (existingBook.rows.length > 0) {
      return res.status(400).json({
        message: "Book title already exists",
      });
    }

    // ✅ توليد ISBN (10 أرقام + unique)
    let isbn;
    let exists = true;

    while (exists) {
      isbn = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const check = await pool.query("SELECT id FROM books WHERE isbn = $1", [
        isbn,
      ]);

      exists = check.rows.length > 0;
    }

    // ✅ الصور
    let shortUrl = null;
    let longUrl = null;
    let shortPublicId = null;
    let longPublicId = null;

    if (req.files?.cover_short) {
      const uploaded = await uploadToCloudinary(
        req.files.cover_short[0].buffer,
        "books/short",
      );

      shortUrl = uploaded.secure_url;
      shortPublicId = uploaded.public_id;
    }

    if (req.files?.cover_long) {
      const uploaded = await uploadToCloudinary(
        req.files.cover_long[0].buffer,
        "books/long",
      );

      longUrl = uploaded.secure_url;
      longPublicId = uploaded.public_id;
    }

    // ✅ إدخال البيانات
    const result = await pool.query(
      `INSERT INTO books
      (title, description, short_description,
       app_store_url, google_play_url, online_book_url,
       cover_image_url_short, cover_image_url_long,
       cover_image_short_public_id, cover_image_long_public_id,
       isbn, created_by, category_id, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        title,
        description,
        short_description,
        app_store_url,
        google_play_url,
        online_book_url,
        shortUrl,
        longUrl,
        shortPublicId,
        longPublicId,
        isbn,
        req.user.id,
        category_id,
        "Draft", // ✅ default
      ],
    );

    const createdBook = result.rows[0];

    // ✅ Activity log
    try {
      await logActivity({
        type: "book",
        action: "create",

        title: "Book Created",
        description: `Created book "${createdBook.title}"`,

        actor_id: req.user.id,
        actor_role: req.user.role,

        book_id: createdBook.id,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
  b.*,
  u.full_name AS created_by_name,
  c.name AS category_name
FROM books b
LEFT JOIN users u ON b.created_by = u.id
LEFT JOIN categories c ON b.category_id = c.id
ORDER BY b.created_at DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBooksPublic = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.description,
        b.short_description,
        b.cover_image_url_short,
        b.cover_image_url_long,
        c.name AS category
      FROM books b
      LEFT JOIN categories c 
        ON b.category_id = c.id
      WHERE b.status = 'Published'
      ORDER BY b.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get books (public) error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
  b.*,
  u.full_name AS created_by_name,
  c2.name AS category_name,

  ARRAY_AGG(DISTINCT c.class_name) AS classes

FROM books b

LEFT JOIN users u ON b.created_by = u.id
LEFT JOIN categories c2 ON b.category_id = c2.id

LEFT JOIN classes c ON c.book_id = b.id

WHERE b.id = $1
GROUP BY b.id, u.full_name, c2.name`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPuplicBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        b.id,
        b.title,
        b.description,
        b.cover_image_url_short,
        b.cover_image_url_long,
        b.created_at,
        b.youtube_url,
        b.isbn
      FROM books b
      WHERE b.id = $1 
      ORDER BY b.created_at DESC`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const book = existing.rows[0];

    if (book.cover_image_short_public_id) {
      await cloudinary.uploader.destroy(book.cover_image_short_public_id);
    }

    if (book.cover_image_long_public_id) {
      await cloudinary.uploader.destroy(book.cover_image_long_public_id);
    }

    await pool.query("DELETE FROM books WHERE id = $1", [id]);

    try {
      await logActivity({
        type: "book",
        action: "delete",

        title: "Book Deleted",
        description: `Deleted book "${book.title}"`,

        actor_id: req.user.id,
        actor_role: req.user.role,

        book_id: book.id,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await pool.query("SELECT * FROM books WHERE id=$1", [
      id,
    ]);

    if (existingBook.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const book = existingBook.rows[0];

    // ✅ تحقق من تكرار الاسم
    if (req.body.title) {
      const duplicate = await pool.query(
        `SELECT id FROM books 
         WHERE LOWER(title) = LOWER($1) 
         AND id != $2`,
        [req.body.title.trim(), id],
      );

      if (duplicate.rows.length > 0) {
        return res.status(400).json({
          message: "Book title already exists",
        });
      }
    }

    // ✅ الصور
    let shortUrl = book.cover_image_url_short;
    let shortPublicId = book.cover_image_short_public_id;

    let longUrl = book.cover_image_url_long;
    let longPublicId = book.cover_image_long_public_id;

    if (req.files?.cover_short) {
      if (shortPublicId) {
        await cloudinary.uploader.destroy(shortPublicId);
      }

      const uploaded = await uploadToCloudinary(
        req.files.cover_short[0].buffer,
        "books/short",
      );

      shortUrl = uploaded.secure_url;
      shortPublicId = uploaded.public_id;
    }

    if (req.files?.cover_long) {
      if (longPublicId) {
        await cloudinary.uploader.destroy(longPublicId);
      }

      const uploaded = await uploadToCloudinary(
        req.files.cover_long[0].buffer,
        "books/long",
      );

      longUrl = uploaded.secure_url;
      longPublicId = uploaded.public_id;
    }

    // ✅ update بدون ISBN
    const result = await pool.query(
      `
      UPDATE books
      SET title=$1,
          description=$2,
          short_description=$3,
          app_store_url=$4,
          google_play_url=$5,
          online_book_url=$6,
          cover_image_url_short=$7,
          cover_image_url_long=$8,
          cover_image_short_public_id=$9,
          cover_image_long_public_id=$10,
          status=$11,
          language=$12,
          category_id=$13,
          updated_at=NOW()
      WHERE id=$14
      RETURNING *
      `,
      [
        req.body.title,
        req.body.description,
        req.body.short_description,
        req.body.app_store_url,
        req.body.google_play_url,
        req.body.online_book_url,
        shortUrl,
        longUrl,
        shortPublicId,
        longPublicId,
        req.body.status,
        req.body.language,
        req.body.category_id,
        id,
      ],
    );

    const updatedBook = result.rows[0];

    // ✅ Activity log
    try {
      await logActivity({
        type: "book",
        action: "update",

        title: "Book Updated",
        description: `Updated book "${updatedBook.title}"`,

        actor_id: req.user.id,
        actor_role: req.user.role,

        book_id: updatedBook.id,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getBooksGrowth = async (req, res) => {
  const { start } = req.query;

  try {
    const result = await pool.query(
      `
SELECT
  FLOOR(EXTRACT(EPOCH FROM (published_at - $1::timestamp)) / 86400 / 7)::int AS week_index,
  COUNT(*)::int AS value
FROM books
WHERE published_at >= $1::timestamp
AND published_at <= $1::timestamp + INTERVAL '35 days'
AND status = 'Published'
GROUP BY week_index
ORDER BY week_index;
  `,
      [start],
    );

    const counts = [0, 0, 0, 0, 0];
    result.rows.forEach((row) => {
      if (row.week_index >= 0 && row.week_index < 5) {
        counts[row.week_index] = row.value;
      }
    });

    const response = counts.map((value, index) => ({
      value,
    }));

    res.json(response);
  } catch (error) {
    console.error("Books growth error:", error);
    res.status(500).json({ message: "error" });
  }
};

const getTopBooks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, created_at, views
      FROM books
      ORDER BY views DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Top books error:", error);
    res.status(500).json({ message: "error" });
  }
};
const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const book = existing.rows[0];

    // 🔥 قلب الحالة
    const newStatus = book.status === "Published" ? "Draft" : "Published";

    const result = await pool.query(
      `
  UPDATE books
  SET status = $1::text,
      published_at = CASE 
        WHEN $1::text = 'Published' THEN NOW()
        WHEN $1::text = 'Draft' THEN NULL
        ELSE published_at
      END,
      updated_at = NOW()
  WHERE id = $2
  RETURNING *
  `,
      [newStatus, id],
    );

    const updatedBook = result.rows[0];

    // 🔥 Activity
    let action, titleText, desc;

    if (newStatus === "Published") {
      action = "published";
      titleText = "Book published";
      desc = `Book "${book.title}" is now published`;
    } else {
      action = "unpublished";
      titleText = "Book unpublished";
      desc = `Book "${book.title}" moved to draft`;
    }

    try {
      await logActivity({
        type: "book",

        action: newStatus === "Published" ? "publish" : "draft",

        title: newStatus === "Published" ? "Book Published" : "Book Drafted",

        description:
          newStatus === "Published"
            ? `Published "${book.title}"`
            : `Moved "${book.title}" to draft`,

        actor_id: req.user.id,
        actor_role: req.user.role,

        book_id: book.id,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const duplicateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ جيب الكتاب الأصلي
    const bookResult = await pool.query("SELECT * FROM books WHERE id=$1", [
      id,
    ]);

    if (!bookResult.rows.length) {
      return res.status(404).json({ message: "Book not found" });
    }

    const b = bookResult.rows[0];

    // 🔥 1. اسم أساسي بدون Copy
    const baseTitle = b.title.replace(/\s\(Copy.*\)$/, "");

    // 🔥 2. احسب عدد النسخ
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM books WHERE title ILIKE $1`,
      [`${baseTitle}%`],
    );

    const copyCount = parseInt(countResult.rows[0].count);

    // 🔥 3. اسم جديد
    const newTitle =
      copyCount === 0
        ? `${baseTitle} (Copy)`
        : `${baseTitle} (Copy ${copyCount})`;

    // 🔥 4. توليد ISBN
    let isbn;
    let exists = true;

    while (exists) {
      isbn = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const check = await pool.query("SELECT id FROM books WHERE isbn = $1", [
        isbn,
      ]);

      exists = check.rows.length > 0;
    }

    // ✅ 5. إدخال النسخة الجديدة
    const result = await pool.query(
      `INSERT INTO books
      (title, description, short_description,
       app_store_url, google_play_url, online_book_url,
       cover_image_url_short, cover_image_url_long,
       cover_image_short_public_id, cover_image_long_public_id,
       isbn, created_by, category_id, status, language)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        newTitle,
        b.description || null,
        b.short_description || null,
        b.app_store_url || null,
        b.google_play_url || null,
        b.online_book_url || null,
        b.cover_image_url_short || null,
        b.cover_image_url_long || null,
        b.cover_image_short_public_id || null,
        b.cover_image_long_public_id || null,
        isbn,
        req.user.id,
        b.category_id || null,
        "Draft", // 🔥 دايمًا Draft
        b.language || null,
      ],
    );
    const duplicatedBook = result.rows[0];

    await logActivity({
      type: "book",
      action: "duplicate",

      title: "Book Duplicated",
      description: `Duplicated "${b.title}"`,

      actor_id: req.user.id,
      actor_role: req.user.role,

      book_id: duplicatedBook.id,
    });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Duplicate error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  getAllBooksPublic,
  getPuplicBookById,
  getBooksGrowth,
  getTopBooks,
  updateBookStatus,
  duplicateBook,
};
