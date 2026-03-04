const pool = require("../database/connection");

const activateBookCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const result = await pool.query(
      `SELECT * FROM book_codes WHERE code = $1`,
      [code],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid code" });
    }

    const bookCode = result.rows[0];

    if (bookCode.is_used) {
      return res.status(400).json({ message: "Code already used" });
    }

    if (bookCode.allowed_role && bookCode.allowed_role !== userRole) {
      return res
        .status(403)
        .json({ message: "Code not allowed for your role" });
    }

    const existing = await pool.query(
      `SELECT 1 FROM user_books WHERE user_id = $1 AND book_id = $2`,
      [userId, bookCode.book_id],
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ message: "Book already activated" });
    }

    await pool.query(
      `
      INSERT INTO user_books
      (user_id, book_id, code_id, activated_at, expires_at)
      VALUES (
        $1,
        $2,
        $3,
        NOW(),
        NOW() + ($4 || ' months')::interval
      )
      `,
      [userId, bookCode.book_id, bookCode.id, bookCode.validity_months],
    );

    await pool.query(
      `
      UPDATE book_codes
      SET is_used = true,
          used_by = $1,
          used_at = NOW()
      WHERE id = $2
      `,
      [userId, bookCode.id],
    );

    return res.json({ message: "Book activated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,                     
        ub.id AS user_book_id,
        ub.activated_at,
        ub.expires_at,
        ub.created_at AS enrolled_at,
        CASE 
          WHEN NOW() > ub.expires_at THEN false
          ELSE true
        END AS is_active
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = $1
      ORDER BY ub.activated_at DESC
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get my books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getMyBookById = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,                     
        ub.id AS user_book_id,
        ub.activated_at,
        ub.expires_at,
        ub.created_at AS enrolled_at
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = $1
      AND ub.book_id = $2
      LIMIT 1
      `,
      [userId, bookId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Book not found for this user",
      });
    }

    const book = result.rows[0];

    if (new Date() > new Date(book.expires_at)) {
      return res.status(403).json({
        message: "Book access expired",
      });
    }

    res.json(book);
  } catch (error) {
    console.error("Get my book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  activateBookCode,
  getMyBooks,
  getMyBookById,
};
