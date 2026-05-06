const pool = require("../database/connection");
const generateCode = require("../utils/generateCode");
const logActivity = require("../utils/activityLogger");
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

    try {
      await logActivity({
        type: "code",
        action: "created",

        title: "New code generated",

        description: `${createdCodes.length} code(s) created`,

        actor_id: req.user.id,
        actor_role: req.user.role,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
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
const updateCodeValidity = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { validity_months } = req.body;

    // ✅ validation
    if (!validity_months || isNaN(validity_months)) {
      return res.status(400).json({
        message: "validity_months must be a valid number",
      });
    }

    if (validity_months <= 0) {
      return res.status(400).json({
        message: "validity_months must be greater than 0",
      });
    }

    await client.query("BEGIN");

    // 1️⃣ تأكد الكود موجود
    const codeCheck = await client.query(
      "SELECT * FROM book_codes WHERE id = $1",
      [id],
    );

    if (codeCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Code not found" });
    }

    // 2️⃣ تحديث الكود
    const updatedCode = await client.query(
      `UPDATE book_codes
       SET validity_months = $1
       WHERE id = $2
       RETURNING *`,
      [validity_months, id],
    );

    // 3️⃣ تحديث المستخدمين المرتبطين بهذا الكود 🔥
    await client.query(
      `
      UPDATE user_books
      SET expires_at = activated_at + ($1 || ' months')::interval
      WHERE code_id = $2
      `,
      [validity_months, id],
    );

    await client.query("COMMIT");
    try {
      await logActivity({
        type: "code",
        action: "updated",

        title: "Code updated",

        description: `Code validity updated`,

        actor_id: req.user.id,
        actor_role: req.user.role,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.json({
      message: "Code and related subscriptions updated successfully",
      code: updatedCode.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update code error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
const deleteCode = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT is_used FROM book_codes WHERE id = $1",
      [id],
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ message: "Code not found" });
    }

    if (check.rows[0].is_used) {
      return res.status(400).json({
        message: "Cannot delete a used code",
      });
    }

    await pool.query("DELETE FROM book_codes WHERE id = $1", [id]);
    try {
      await logActivity({
        type: "code",
        action: "deleted",

        title: "Code deleted",

        description: `Code removed`,

        actor_id: req.user.id,
        actor_role: req.user.role,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.json({ message: "Code deleted successfully" });
  } catch (error) {
    console.error("Delete code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createCode,
  getAllCodes,
  importCodes,
  getCodeByBookId,
  updateCodeValidity,
  deleteCode,
};
