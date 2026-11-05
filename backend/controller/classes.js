const pool = require("../database/connection");
const logActivity = require("../utils/activityLogger");

const findTeacherClass = async (classId, teacherId) => {
  const result = await pool.query(
    `SELECT c.id, c.class_name, c.book_id, c.teacher_id, c.created_at,
            b.title AS book_title, b.cover_image_url_short AS cover_image
       FROM classes c
       JOIN books b ON b.id = c.book_id
      WHERE c.id = $1 AND c.teacher_id = $2`,
    [classId, teacherId],
  );

  return result.rows[0];
};

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
    b.cover_image_url_short AS cover_image,
    c.created_at,

    COUNT(cs.student_id)::int AS total_students

  FROM classes c

  LEFT JOIN class_students cs 
    ON cs.class_id = c.id

  JOIN books b 
    ON b.id = c.book_id

  WHERE c.teacher_id = $1

  GROUP BY 
    c.id,
    b.title,
    b.cover_image_url_short

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
const getStudentClasses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT
  c.id,
  c.class_name,
  c.book_id,
  b.title AS book_title,
  b.cover_image_url_short,
  b.cover_image_url_long,
  c.created_at,
  c.teacher_id,
  u.full_name AS teacher_name
  ,cs.joined_at
  ,(SELECT COUNT(*)::int
      FROM class_students all_students
     WHERE all_students.class_id = c.id) AS total_students

FROM class_students cs

JOIN classes c
  ON c.id = cs.class_id

JOIN books b
  ON b.id = c.book_id

JOIN users u
  ON u.id = c.teacher_id

WHERE cs.student_id = $1

ORDER BY c.created_at DESC
      `,
      [studentId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get student classes error:", error);
    res.status(500).json({ message: "error" });
  }
};

const getTeacherClassDetails = async (req, res) => {
  try {
    const classData = await findTeacherClass(req.params.classId, req.user.id);
    if (!classData) return res.status(404).json({ message: "Class not found" });

    const [studentsResult, activitiesResult, notesResult, eventsResult] =
      await Promise.all([
        pool.query(
          `SELECT u.id, u.full_name, u.email, u.avatar_url, u.status,
                  cs.joined_at, ub.activated_at, ub.expires_at,
                  ub.last_opened_at,
                  (SELECT COUNT(*)::int FROM activities a
                    WHERE a.class_id = cs.class_id AND a.actor_id = u.id)
                    AS activity_count
             FROM class_students cs
             JOIN users u ON u.id = cs.student_id
             LEFT JOIN user_books ub
               ON ub.user_id = u.id
              AND ub.book_id = $2
              AND ub.class_id = cs.class_id
            WHERE cs.class_id = $1
              AND u.role = 'student'
              AND u.is_deleted = FALSE
            ORDER BY cs.joined_at DESC`,
          [classData.id, classData.book_id],
        ),
        pool.query(
          `SELECT a.*, u.full_name AS actor_name
             FROM activities a
             LEFT JOIN users u ON u.id = a.actor_id
            WHERE a.class_id = $1
            ORDER BY a.created_at DESC`,
          [classData.id],
        ),
        pool.query(
          `SELECT id, class_id, teacher_id, title, subject AS content, is_pinned,
                  created_at, updated_at
             FROM events
            WHERE class_id = $1 AND teacher_id = $2 AND type = 'note'
            ORDER BY is_pinned DESC, created_at DESC`,
          [classData.id, req.user.id],
        ),
        pool.query(
          `SELECT id, title, subject, date, time, is_pinned, created_at
             FROM events
            WHERE class_id = $1 AND teacher_id = $2 AND type = 'event'
            ORDER BY is_pinned DESC, date DESC, time DESC`,
          [classData.id, req.user.id],
        ),
      ]);

    res.json({
      class: { ...classData, total_students: studentsResult.rows.length },
      students: studentsResult.rows,
      activities: activitiesResult.rows,
      notes: notesResult.rows,
      events: eventsResult.rows,
    });
  } catch (error) {
    console.error("Get teacher class details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStudentClassDetails = async (req, res) => {
  try {
    const classResult = await pool.query(
      `SELECT c.id, c.class_name, c.book_id, c.created_at,
              b.title AS book_title, b.cover_image_url_short AS cover_image,
              u.full_name AS teacher_name, cs.joined_at
         FROM class_students cs
         JOIN classes c ON c.id = cs.class_id
         JOIN books b ON b.id = c.book_id
         JOIN users u ON u.id = c.teacher_id
        WHERE cs.class_id = $1 AND cs.student_id = $2`,
      [req.params.classId, req.user.id],
    );

    const classData = classResult.rows[0];
    if (!classData) return res.status(404).json({ message: "Class not found" });

    const [notesResult, eventsResult] = await Promise.all([
      pool.query(
        `SELECT n.id, n.title, n.subject AS content, n.is_pinned,
                n.created_at, n.updated_at,
                u.full_name AS teacher_name
           FROM events n
           JOIN users u ON u.id = n.teacher_id
          WHERE n.class_id = $1 AND n.type = 'note'
          ORDER BY n.is_pinned DESC, n.created_at DESC`,
        [classData.id],
      ),
      pool.query(
        `SELECT id, title, subject, date, time, is_pinned, created_at
           FROM events WHERE class_id = $1 AND type = 'event'
          ORDER BY is_pinned DESC, date DESC, time DESC`,
        [classData.id],
      ),
    ]);

    res.json({
      class: classData,
      notes: notesResult.rows,
      events: eventsResult.rows,
    });
  } catch (error) {
    console.error("Get student class details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createClassNote = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const classData = await findTeacherClass(req.params.classId, req.user.id);
    if (!classData) return res.status(404).json({ message: "Class not found" });

    const result = await pool.query(
      `INSERT INTO events (type, title, subject, teacher_id, book_id, class_id)
       VALUES ('note', $1, $2, $3, $4, $5)
       RETURNING id, class_id, teacher_id, title, subject AS content,
                 created_at, updated_at`,
      [title, content, req.user.id, classData.book_id, classData.id],
    );

    await logActivity({
      type: "note",
      action: "created",
      title: "New class note",
      description: title,
      actor_id: req.user.id,
      actor_role: req.user.role,
      event_id: result.rows[0].id,
      class_id: classData.id,
      book_id: classData.book_id,
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create class note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateClassNote = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const result = await pool.query(
      `UPDATE events n SET title = $1, subject = $2
         FROM classes c
        WHERE n.id = $3 AND n.class_id = $4 AND n.teacher_id = $5
          AND n.type = 'note'
          AND c.id = n.class_id AND c.teacher_id = $5
        RETURNING n.id, n.class_id, n.teacher_id, n.title,
                  n.subject AS content, n.created_at, n.updated_at`,
      [title, content, req.params.noteId, req.params.classId, req.user.id],
    );
    if (!result.rows[0])
      return res.status(404).json({ message: "Note not found" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update class note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteClassNote = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM events n USING classes c
        WHERE n.id = $1 AND n.class_id = $2 AND n.teacher_id = $3
          AND n.type = 'note'
          AND c.id = n.class_id AND c.teacher_id = $3
        RETURNING n.id`,
      [req.params.noteId, req.params.classId, req.user.id],
    );
    if (!result.rows[0])
      return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Delete class note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const setClassItemPinned = async (req, res) => {
  try {
    const { is_pinned } = req.body;
    if (typeof is_pinned !== "boolean") {
      return res.status(400).json({ message: "is_pinned must be a boolean" });
    }

    const result = await pool.query(
      `UPDATE events e SET is_pinned = $1
         FROM classes c
        WHERE e.id = $2 AND e.class_id = $3 AND e.teacher_id = $4
          AND c.id = e.class_id AND c.teacher_id = $4
        RETURNING e.id, e.type, e.is_pinned`,
      [is_pinned, req.params.itemId, req.params.classId, req.user.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Class item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Pin class item error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getTeacherClasses,
  getMyClassesByBook,
  getStudentClasses,
  getTeacherClassDetails,
  getStudentClassDetails,
  createClassNote,
  updateClassNote,
  deleteClassNote,
  setClassItemPinned,
};
