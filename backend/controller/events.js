const pool = require("../database/connection");
const logActivity = require("../utils/activityLogger");

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

    const { title, subject, date, time, book_id, class_id } = req.body;

    const result = await pool.query(
      `
  INSERT INTO events 
  (title, subject, date, time, teacher_id, book_id, class_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
  `,
      [title, subject, date, time, teacherId, book_id, class_id],
    );
    const createdEvent = result.rows[0];

    try {
      await logActivity({
        type: "event",
        action: "created",

        title: "New event created",

        description: `${title} event scheduled`,

        actor_id: req.user.id,
        actor_role: req.user.role,

        event_id: createdEvent.id,
        class_id,
        book_id,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getStudentEvents = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT e.*
      FROM events e

      JOIN class_students cs
        ON cs.class_id = e.class_id

      WHERE cs.student_id = $1

      ORDER BY e.date ASC, e.time ASC
      `,
      [studentId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get student events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// ✅ UPDATE event
const updateEvent = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;
    const { title, subject, date, time, book_id, class_id } = req.body;

    const result = await pool.query(
      `
      UPDATE events
      SET title = $1,
          subject = $2,
          date = $3,
          time = $4,
          book_id = $5,
          class_id = $6
      WHERE id = $7 AND teacher_id = $8
      RETURNING *
      `,
      [title, subject, date, time, book_id, class_id, id, teacherId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    const updatedEvent = result.rows[0];
    try {
      await logActivity({
        type: "event",
        action: "updated",

        title: "Event updated",

        description: `${title} event updated`,

        actor_id: req.user.id,
        actor_role: req.user.role,

        event_id: updatedEvent.id,
        class_id,
        book_id,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE event
const deleteEvent = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM events
      WHERE id = $1 AND teacher_id = $2
      RETURNING *
      `,
      [id, teacherId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getMyEvents,
  createEvent,
  getStudentEvents,
  updateEvent,
  deleteEvent,
};
