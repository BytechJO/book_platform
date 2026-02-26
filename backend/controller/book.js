const pool = require("../database/connection");

const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      app_store_url,
      google_play_url,
      online_book_url,
      cover_image_url,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const existing = await pool.query("SELECT id FROM books WHERE title = $1", [
      title,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Book title already exists" });
    }
    const result = await pool.query(
      `INSERT INTO books 
       (title, description, app_store_url, google_play_url, online_book_url, cover_image_url, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        title,
        description,
        app_store_url,
        google_play_url,
        online_book_url,
        cover_image_url,
        req.user.id,
      ],
    );

    res.status(201).json({
      message: "Book created successfully ",
      book: result.rows[0],
    });
  } catch (error) {
    console.error("Create book error:", error);
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

module.exports = { createBook, getAllBooks, getBookById };
