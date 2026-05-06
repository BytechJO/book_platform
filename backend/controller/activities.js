const pool = require("../database/connection");

const getAllActivities = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM activities
      ORDER BY created_at DESC
      `,
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get activities error:", err);

    res.status(500).json({
      message: "error",
    });
  }
};
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

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

      WHERE NOT (
        a.actor_id = $1
      )

      ORDER BY a.created_at DESC
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "error",
    });
  }
};
const markAllActivitiesAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `
      INSERT INTO activity_reads (activity_id, user_id)

      SELECT a.id, $1
      FROM activities a

      WHERE NOT EXISTS (
        SELECT 1
        FROM activity_reads ar
        WHERE ar.activity_id = a.id
        AND ar.user_id = $1
      )
      `,
      [userId],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "error",
    });
  }
};
module.exports = {
  getAllActivities,
  markAllActivitiesAsRead,
  getMyNotifications,
};
