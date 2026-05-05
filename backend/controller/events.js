const pool = require("../database/connection");

// ✅ GET events للأستاذ الحالي
const getMyEvents = async (req, res) => {
  try {
    const teacherId = req.user.id; // 🔥 أهم سطر

    const result = await pool.query(
      `SELECT *
       FROM events
       WHERE teacher_id = $1
       ORDER BY date ASC, time ASC`,
      [teacherId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ CREATE event
const createEvent = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { title, subject, date, time } = req.body;

    const result = await pool.query(
      `INSERT INTO events (title, subject, date, time, teacher_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, subject, date, time, teacherId],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMyEvents,
  createEvent,
};
