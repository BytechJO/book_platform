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
      app_store_url,
      google_play_url,
      online_book_url,
      isbn,
    } = req.body;

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
    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required" });
    }

    const existingIsbn = await pool.query(
      "SELECT id FROM books WHERE isbn = $1",
      [isbn.trim()],
    );

    if (existingIsbn.rows.length > 0) {
      return res.status(400).json({
        message: "ISBN already exists",
      });
    }
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

    const result = await pool.query(
      `INSERT INTO books
       (title, description, app_store_url,
        google_play_url, online_book_url,
        cover_image_url_short,
        cover_image_url_long,
        cover_image_short_public_id,
        cover_image_long_public_id,
        isbn,
        created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9 ,$10  ,$11)
       RETURNING *`,
      [
        title,
        description,
        app_store_url,
        google_play_url,
        online_book_url,
        shortUrl,
        longUrl,
        shortPublicId,
        longPublicId,
        isbn,
        req.user.id,
      ],
    );

    const createdBook = result.rows[0];

    try {
      await logActivity({
        type: "book",
        action: "created",
        title: "New book published",
        description: `Book "${createdBook.title}" added`,
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
      `SELECT b.*, u.full_name AS created_by_name
       FROM books b
       LEFT JOIN users u ON b.created_by = u.id
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
        b.cover_image_url_short,
        b.cover_image_url_long
      FROM books b
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
      `SELECT b.*, u.full_name AS created_by_name
       FROM books b
         LEFT JOIN users u ON b.created_by = u.id
         WHERE b.id = $1`,
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
        action: "deleted",
        title: "Book deleted",
        description: `Book "${book.title}" removed`,
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
    if (!req.body.isbn) {
      return res.status(400).json({ message: "ISBN is required" });
    }

    const duplicateIsbn = await pool.query(
      `SELECT id FROM books 
   WHERE isbn = $1 
   AND id != $2`,
      [req.body.isbn.trim(), id],
    );

    if (duplicateIsbn.rows.length > 0) {
      return res.status(400).json({
        message: "ISBN already exists",
      });
    }
    const book = existingBook.rows[0];

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

    const result = await pool.query(
      `
  UPDATE books
    SET title=$1,
    description=$2,
    app_store_url=$3,
    google_play_url=$4,
    online_book_url=$5,
    cover_image_url_short=$6,
    cover_image_url_long=$7,
    cover_image_short_public_id=$8,
    cover_image_long_public_id=$9,
    isbn=$10,
    updated_at=NOW()
    WHERE id=$11
    RETURNING *
      `,
      [
        req.body.title,
        req.body.description,
        req.body.app_store_url,
        req.body.google_play_url,
        req.body.online_book_url,
        shortUrl,
        longUrl,
        shortPublicId,
        longPublicId,
        req.body.isbn,
        id,
      ],
    );

    const updatedBook = result.rows[0];

    try {
      await logActivity({
        type: "book",
        action: "updated",
        title: "Book updated",
        description: `Book "${updatedBook.title}" updated`,
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
  FLOOR(EXTRACT(EPOCH FROM (created_at - $1::timestamp)) / 86400 / 7)::int AS week_index,
  COUNT(*)::int AS value
FROM books
WHERE created_at >= $1::timestamp
AND created_at <= $1::timestamp + INTERVAL '35 days'
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
};
