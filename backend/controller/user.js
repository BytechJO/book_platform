const pool = require("../database/connection");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, full_name, role, status, created_at FROM users ORDER BY id DESC",
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

module.exports = {
  getAllUsers,
  toggleUserStatus,
};
