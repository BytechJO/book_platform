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
        ub.book_classes,
       ub.student_class,
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
const getStudentBookById = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,                     
        ub.id AS user_book_id,
        ub.student_class,
        ub.activated_at,
        ub.expires_at,
        ub.created_at AS enrolled_at,

        teacher.user_id AS teacher_id,
        u.full_name AS teacher_name

      FROM user_books ub

      JOIN books b ON ub.book_id = b.id

      -- 👇 الأستاذ لنفس الكتاب
      LEFT JOIN user_books teacher 
        ON teacher.book_id = ub.book_id 
        AND teacher.book_classes IS NOT NULL

      LEFT JOIN users u 
        ON u.id = teacher.user_id

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
    console.error("Get student book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addBookClass = async (req, res) => {
  const { id } = req.params; // user_book_id
  const { class_name } = req.body;

  try {
    const existing = await pool.query(
      `SELECT book_classes FROM user_books WHERE id = $1`,
      [id],
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const currentClasses = existing.rows[0].book_classes || [];

    // ❗ منع التكرار
    if (currentClasses.includes(class_name)) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const result = await pool.query(
      `
      UPDATE user_books
      SET book_classes = array_append(
        COALESCE(book_classes, '{}'),
        $1
      )
      WHERE id = $2
      RETURNING *
      `,
      [class_name, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add class error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const activateClassCode = async (req, res) => {
  const { id } = req.params; // user_book_id تبع الطالب
  const { class_code } = req.body;
  const userId = req.user.id;

  try {
    const normalizedCode = class_code?.trim();

    if (!normalizedCode) {
      return res.status(400).json({ message: "Class code is required" });
    }

    // 1) نجيب book_id تبع الطالب
    const studentBook = await pool.query(
      `SELECT book_id, student_class FROM user_books WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (studentBook.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookId = studentBook.rows[0].book_id;
    const sameBookClass = await pool.query(
      `
      SELECT 1
      FROM user_books
      WHERE book_id = $1
        AND user_id != $2
        AND $3 = ANY(COALESCE(book_classes, '{}'::text[]))
      LIMIT 1
      `,
      [bookId, userId, normalizedCode],
    );

    if (sameBookClass.rowCount > 0) {
      const updated = await pool.query(
        `
        UPDATE user_books
        SET student_class = $1
        WHERE id = $2
        RETURNING *
        `,
        [normalizedCode, id],
      );

      return res.json(updated.rows[0]);
    }

    // 3) إذا مش موجود لهذا الكتاب، هل موجود بكتاب ثاني؟
    const existsInAnotherBook = await pool.query(
      `
      SELECT book_id
      FROM user_books
      WHERE user_id != $1
        AND $2 = ANY(COALESCE(book_classes, '{}'::text[]))
      LIMIT 1
      `,
      [userId, normalizedCode],
    );

    if (existsInAnotherBook.rowCount > 0) {
      return res.status(400).json({
        message: "This class code belongs to another book",
      });
    }

    // 4) مش موجود أصلًا
    return res.status(404).json({
      message: "Class code does not exist",
    });
  } catch (err) {
    console.error("activateClassCode error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  activateBookCode,
  getMyBooks,
  getMyBookById,
  addBookClass,
  activateClassCode,
  getStudentBookById,
};
