const pool = require("../database/connection");

const getStudentActivities = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `
  SELECT *
  FROM activities

  WHERE

  (
    actor_id = $1
    AND actor_role = 'student'
  )

  OR

  (
    class_id IN (
      SELECT class_id
      FROM class_students
      WHERE student_id = $1
    )

    AND actor_role = 'teacher'
  )

  ORDER BY created_at DESC
  `,
      [studentId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "error",
    });
  }
};
const getStudentNotifications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        a.*,

        CASE
          WHEN ar.id IS NOT NULL THEN true
          ELSE false
        END AS is_read

      FROM activities a

      LEFT JOIN activity_reads ar
      ON ar.activity_id = a.id
      AND ar.user_id = $1

      WHERE

      a.class_id IN (
        SELECT class_id
        FROM class_students
        WHERE student_id = $1
      )

      AND a.actor_id != $1

      ORDER BY a.created_at DESC
      `,
      [studentId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "error",
    });
  }
};
module.exports = {
  getStudentActivities,
  getStudentNotifications,
};
