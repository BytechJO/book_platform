const pool = require("../database/connection");

const logActivity = async ({
  type,
  action,

  title,
  description,

  actor_id,
  actor_role,

  receiver_id = null,

  book_id = null,
  class_id = null,
  event_id = null,
}) => {
  try {
    await pool.query(
      `
      INSERT INTO activities (
        type,
        action,

        title,
        description,

        actor_id,
        actor_role,

        receiver_id,

        book_id,
        class_id,
        event_id
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      `,
      [
        type,
        action,

        title,
        description,

        actor_id,
        actor_role,

        receiver_id,

        book_id,
        class_id,
        event_id,
      ],
    );
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

module.exports = logActivity;
