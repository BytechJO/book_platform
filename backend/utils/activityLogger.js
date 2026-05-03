const pool = require("../database/connection");

const logActivity = async ({ type, action, title, description }) => {
  try {
    await pool.query(
      `
      INSERT INTO activities (type, action, title, description)
      VALUES ($1, $2, $3, $4)
      `,
      [type, action, title, description]
    );
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

module.exports = logActivity;