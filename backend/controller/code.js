const pool = require("../database/connection");
const generateCode = require("../utils/generateCode");
const { v4: uuidv4 } = require("uuid");

const createCode = async (req, res) => {
  try {
    const { book_id, allowed_role, validity_months, number_of_codes } =
      req.body;

    const count = Number(number_of_codes) || 1;

    if (count <= 0) {
      return res.status(400).json({
        message: "number_of_codes must be greater than 0",
      });
    }

    if (book_id) {
      const bookCheck = await pool.query("SELECT id FROM books WHERE id = $1", [
        book_id,
      ]);

      if (bookCheck.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
    }

    const createdCodes = [];

    for (let i = 0; i < count; i++) {
      let code;
      let exists = true;

      while (exists) {
        code = generateCode(10);

        const check = await pool.query(
          "SELECT id FROM book_codes WHERE code = $1",
          [code],
        );

        exists = check.rows.length > 0;
      }

      const result = await pool.query(
        `INSERT INTO book_codes (book_id, code, validity_months, allowed_role)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [book_id || null, code, validity_months || 12, allowed_role || null],
      );

      createdCodes.push(result.rows[0]);
    }

    res.status(201).json({
      message: `${createdCodes.length} code(s) created successfully`,
      codes: createdCodes,
    });
  } catch (error) {
    console.error("Create code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCodes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bc.id, bc.code, bc.validity_months, bc.allowed_role, bc.created_at,bc.is_used,bc.used_at,
              b.id AS book_id, b.title AS book_title
       FROM book_codes bc
       LEFT JOIN books b ON bc.book_id = b.id
       ORDER BY bc.created_at DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get codes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const importCodes = async (req, res) => {
  try {
    const { codes } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ message: "No codes provided" });
    }

    const insertedCodes = [];

    for (const item of codes) {
      const {
        code,
        validity_months,
        allowed_role,
        is_used,
        created_at,
        used_at,
        book_id,
      } = item;

      if (!code) continue;

      const exists = await pool.query(
        "SELECT id FROM book_codes WHERE code = $1",
        [code],
      );

      if (exists.rows.length > 0) {
        continue; 
      }

      const result = await pool.query(
        `INSERT INTO book_codes 
        (book_id, code, validity_months, allowed_role, is_used, created_at, used_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          book_id || null,
          code,
          validity_months || 12,
          allowed_role || null,
          is_used || false,
          created_at || new Date(),
          used_at || null,
        ],
      );

      insertedCodes.push(result.rows[0]);
    }

    res.status(201).json({
      message: `${insertedCodes.length} code(s) imported successfully`,
      codes: insertedCodes,
    });
  } catch (error) {
    console.error("Import code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCodeByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;
    const result = await pool.query(
      `SELECT id, code, validity_months, allowed_role, created_at, is_used
        FROM book_codes
        WHERE book_id = $1
        ORDER BY created_at DESC`,
      [bookId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get codes by book ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
};

module.exports = {
  createCode,
  getAllCodes,
  importCodes,
  getCodeByBookId,
};
