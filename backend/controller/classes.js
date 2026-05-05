const pool = require("../database/connection");

const getTeacherClasses = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT
        c.id,
        c.class_name,
        c.book_id,
        b.title AS book_title,
        c.created_at,

        COUNT(cs.student_id) AS total_students

      FROM classes c

      LEFT JOIN class_students cs 
        ON cs.class_id = c.id

      JOIN books b 
        ON b.id = c.book_id

      WHERE c.teacher_id = $1

      GROUP BY c.id, b.title

      ORDER BY c.created_at DESC
      `,
      [teacherId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get teacher classes error:", error);
    res.status(500).json({ message: "error" });
  }
};
const getMyClassesByBook = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { bookId } = req.params;

    const result = await pool.query(
      `
      SELECT id, class_name
      FROM classes
      WHERE teacher_id = $1 AND book_id = $2
      ORDER BY class_name ASC
      `,
      [teacherId, bookId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getTeacherClasses,
  getMyClassesByBook,
};
