const pool = require("../database/connection");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `
  SELECT id, email, full_name, role, status, created_at, avatar_url
  FROM users
  WHERE is_deleted = FALSE
  ORDER BY id DESC
  `,
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const toggleUserStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET 
        status = CASE
          WHEN status = 'active' THEN 'inactive'
          ELSE 'active'
        END,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, status, updated_at
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User status updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getUsersGrowth = async (req, res) => {
  const { start } = req.query;

  if (!start) {
    return res.status(400).json({ message: "Start date is required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        FLOOR((created_at::date - $1::date) / 7)::int AS week_index,
        COUNT(*)::int AS value
      FROM users
      WHERE created_at::date >= $1::date
        AND created_at::date < $1::date + INTERVAL '35 days'
      GROUP BY week_index
      ORDER BY week_index
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
      name: new Date(
        new Date(start).setDate(new Date(start).getDate() + index * 7),
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value,
    }));

    return res.json(response);
  } catch (error) {
    console.error("Users growth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getActivities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM activities
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get activities error:", err);
    res.status(500).json({ message: "error" });
  }
};
const softDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET is_deleted = TRUE
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Soft delete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getUserFullDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ user
    const userResult = await pool.query(
      `SELECT id, email, full_name, role, status, created_at, avatar_url
       FROM users
       WHERE id = $1 AND is_deleted = FALSE`,
      [id],
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // ✅ books
    const booksResult = await pool.query(
      `
      SELECT b.id, b.title, b.cover_image_url_short
      FROM user_books ub
      JOIN books b ON b.id = ub.book_id
      WHERE ub.user_id = $1
      `,
      [id],
    );

    // ✅ used codes
    const codesResult = await pool.query(
      `
      SELECT COUNT(*) AS used_codes
      FROM book_codes
      WHERE used_by = $1 AND is_used = true
      `,
      [id],
    );

    let classes = [];

    // ✅ classes
    if (user.role === "teacher") {
      const result = await pool.query(
        `
        SELECT DISTINCT unnest(book_classes) AS class_name
        FROM user_books
        WHERE user_id = $1 AND book_classes IS NOT NULL
        `,
        [id],
      );
      classes = result.rows;
    } else {
      const result = await pool.query(
        `
        SELECT DISTINCT student_class
        FROM user_books
        WHERE user_id = $1 AND student_class IS NOT NULL
        `,
        [id],
      );
      classes = result.rows;
    }

    // ✅ response
    res.json({
      user,
      books: booksResult.rows,
      used_codes: parseInt(codesResult.rows[0].used_codes),
      classes,
    });
  } catch (error) {
    console.error("Get user full details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const result = await pool.query(
      `
  UPDATE users
  SET role = COALESCE($1, role),
      status = COALESCE($2, status),
      updated_at = NOW()
  WHERE id = $3
  RETURNING id, email, full_name, role, status, created_at, avatar_url
  `,
      [role, status, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};
module.exports = {
  getAllUsers,
  toggleUserStatus,
  getUsersGrowth,
  getActivities,
  softDeleteUser,
  getUserFullDetails,
  updateUser,
};
