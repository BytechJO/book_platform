const pool = require("../database/connection");

const getTeacherActivities = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM activities

      WHERE

      (
        actor_id = $1
        AND actor_role = 'teacher'
      )

      OR

      (
        class_id IN (
          SELECT id
          FROM classes
          WHERE teacher_id = $1
        )

        AND actor_id != $1
      )

      ORDER BY created_at DESC
      `,
      [teacherId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "error",
    });
  }
};
const getTeacherNotifications = async (req, res) => {
  try {
    const teacherId = req.user.id;

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
      SELECT id
      FROM classes
      WHERE teacher_id = $1
    )

  AND a.actor_id != $1

  ORDER BY a.created_at DESC
  `,
      [teacherId],
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
  getTeacherActivities,
  getTeacherNotifications,
};
