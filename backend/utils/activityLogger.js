const pool = require("../database/connection");

const logActivity = async ({
  type,
  action,
  title,
  description,
  teacher_id = null,
}) => {
  try {
    await pool.query(
      `
      INSERT INTO activities (type, action, title, description, teacher_id)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [type, action, title, description, teacher_id],
    );
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

module.exports = logActivity;

module.exports = logActivity;
