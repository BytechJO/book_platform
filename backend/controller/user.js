const pool = require("../database/connection");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, full_name, role, created_at FROM users ORDER BY id DESC"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
};