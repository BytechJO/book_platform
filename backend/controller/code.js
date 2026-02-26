const pool = require("../database/connection");
const generateCode = require("../utils/generateCode");

const createCode = async (req, res) => {
  try {
    const { book_id, allowed_role, validity_months } = req.body;

    if (!book_id) {
      return res.status(400).json({ message: "book_id is required" });
    }

    const bookCheck = await pool.query(
      "SELECT id FROM books WHERE id = $1",
      [book_id]
    );

    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    let code;
    let exists = true;

    while (exists) {
      code = generateCode(10);

      const check = await pool.query(
        "SELECT id FROM book_codes WHERE code = $1",
        [code]
      );

      exists = check.rows.length > 0;
    }

    const result = await pool.query(
      `INSERT INTO book_codes (book_id, code, validity_months, allowed_role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        book_id,
        code,
        validity_months || 12,
        allowed_role || null,
      ]
    );

    res.status(201).json({
      message: "Code created successfully ",
      code: result.rows[0],
    });

  } catch (error) {
    console.error("Create code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCodes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bc.id, bc.code, bc.validity_months, bc.allowed_role, bc.created_at,bc.is_used,
              b.id AS book_id, b.title AS book_title
       FROM book_codes bc
       JOIN books b ON bc.book_id = b.id
       ORDER BY bc.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get codes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCode,
  getAllCodes,
};
