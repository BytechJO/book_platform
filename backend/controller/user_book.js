const pool = require("../database/connection");
const logActivity = require("./../utils/activityLogger");
const activateBookCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const result = await pool.query(
      `SELECT * FROM book_codes WHERE code = $1`,
      [code],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid code" });
    }

    const bookCode = result.rows[0];

    if (bookCode.is_used) {
      return res.status(400).json({ message: "Code already used" });
    }

    if (bookCode.allowed_role && bookCode.allowed_role !== userRole) {
      return res
        .status(403)
        .json({ message: "Code not allowed for your role" });
    }

    const existing = await pool.query(
      `SELECT 1 FROM user_books WHERE user_id = $1 AND book_id = $2`,
      [userId, bookCode.book_id],
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ message: "Book already activated" });
    }

    await pool.query(
      `
      INSERT INTO user_books
      (user_id, book_id, code_id, activated_at, expires_at)
      VALUES (
        $1,
        $2,
        $3,
        NOW(),
        NOW() + ($4 || ' months')::interval
      )
      `,
      [userId, bookCode.book_id, bookCode.id, bookCode.validity_months],
    );

    await pool.query(
      `
      UPDATE book_codes
      SET is_used = true,
          used_by = $1,
          used_at = NOW()
      WHERE id = $2
      `,
      [userId, bookCode.id],
    );
    await logActivity({
      type: "book",
      action: "activate",
      title: "Book Activated",
      description: `Activated book ${bookCode.book_id}`,
      teacher_id: userRole === "teacher" ? userId : null,
    });
    return res.json({ message: "Book activated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,                     
        ub.id AS user_book_id,
        ub.class_id,
        c.class_name,
        ub.activated_at,
        ub.expires_at,
        ub.last_opened_at,
        ub.created_at AS enrolled_at,
        CASE 
          WHEN NOW() > ub.expires_at THEN false
          ELSE true
        END AS is_active
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      LEFT JOIN classes c ON c.id = ub.class_id
      WHERE ub.user_id = $1
      ORDER BY ub.activated_at DESC
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get my books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getMyBookById = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;
  await pool.query(
    `
  UPDATE user_books
  SET last_opened_at = NOW()
  WHERE user_id = $1 AND book_id = $2
  `,
    [userId, bookId],
  );
  await pool.query(
    `
  UPDATE books
  SET views = views + 1
  WHERE id = $1
  `,
    [bookId],
  );
  try {
    const result = await pool.query(
      `
     SELECT 
  b.*,                     
  ub.id AS user_book_id,
  ub.class_id,
  ub.activated_at,
  ub.expires_at,
  ub.created_at AS enrolled_at,

  COALESCE(
    JSON_AGG(
      DISTINCT JSONB_BUILD_OBJECT(
        'id', c.id,
        'class_name', c.class_name
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) AS classes

FROM user_books ub
JOIN books b ON ub.book_id = b.id
LEFT JOIN classes c ON c.book_id = b.id AND c.teacher_id = ub.user_id

WHERE ub.user_id = $1
AND ub.book_id = $2

GROUP BY b.id, ub.id
      `,
      [userId, bookId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Book not found for this user",
      });
    }

    const book = result.rows[0];

    if (new Date() > new Date(book.expires_at)) {
      return res.status(403).json({
        message: "Book access expired",
      });
    }

    res.json(book);
  } catch (error) {
    console.error("Get my book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getStudentBookById = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;
  await pool.query(
    `
  UPDATE books
  SET views = views + 1
  WHERE id = $1
  `,
    [bookId],
  );
  try {
    const result = await pool.query(
      `
      SELECT 
  b.*,                     
  ub.id AS user_book_id,
  ub.class_id,
  c.class_name,
  ub.activated_at,
  ub.expires_at,
  ub.created_at AS enrolled_at,

  c.teacher_id,
  u.full_name AS teacher_name

FROM user_books ub

JOIN books b ON ub.book_id = b.id

LEFT JOIN classes c 
  ON c.id = ub.class_id

LEFT JOIN users u 
  ON u.id = c.teacher_id

WHERE ub.user_id = $1
AND ub.book_id = $2

LIMIT 1
      `,
      [userId, bookId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Book not found for this user",
      });
    }

    const book = result.rows[0];

    if (new Date() > new Date(book.expires_at)) {
      return res.status(403).json({
        message: "Book access expired",
      });
    }

    res.json(book);
  } catch (error) {
    console.error("Get student book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addBookClass = async (req, res) => {
  const { id } = req.params; // user_book_id
  const { class_name } = req.body;
  const teacherId = req.user.id;

  try {
    const existing = await pool.query(
      `SELECT book_id FROM user_books WHERE id = $1 AND user_id = $2`,
      [id, teacherId],
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const bookId = existing.rows[0].book_id;

    const result = await pool.query(
      `
      INSERT INTO classes (class_name, book_id, teacher_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [class_name.trim(), bookId, teacherId],
    );
    const newClass = result.rows[0];

    await logActivity({
      type: "class",
      action: "create",
      title: "New Class",
      description: `Created class ${newClass.class_name}`,
      teacher_id: teacherId,
    });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Class already exists" });
    }

    console.error("Add class error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const activateClassCode = async (req, res) => {
  const { id } = req.params; // user_book_id تبع الطالب
  const { class_code } = req.body;
  const userId = req.user.id;

  try {
    const normalizedCode = class_code?.trim();

    if (!normalizedCode) {
      return res.status(400).json({ message: "Class code is required" });
    }

    // ✅ تأكد الطالب عنده الكتاب
    const studentBook = await pool.query(
      `SELECT book_id FROM user_books WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (studentBook.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookId = studentBook.rows[0].book_id;

    // ✅ جيب الكلاس + teacher_id
    const classResult = await pool.query(
      `
      SELECT id, teacher_id
      FROM classes
      WHERE book_id = $1
        AND class_name = $2
      LIMIT 1
      `,
      [bookId, normalizedCode],
    );

    if (classResult.rowCount === 0) {
      return res.status(404).json({ message: "Invalid class code" });
    }

    const classId = classResult.rows[0].id;
    const teacherId = classResult.rows[0].teacher_id;

    // ✅ اربط الطالب بالكلاس
    await pool.query(
      `
      UPDATE user_books
      SET class_id = $1
      WHERE id = $2 AND user_id = $3
      `,
      [classId, id, userId],
    );

    // ✅ دخّل الطالب في class_students
    await pool.query(
      `
      INSERT INTO class_students (class_id, student_id)
      VALUES ($1, $2)
      ON CONFLICT (class_id, student_id) DO NOTHING
      `,
      [classId, userId],
    );
    const studentName = req.user.full_name;
    // 🔥 أهم خطوة: سجل activity للأستاذ
    await logActivity({
      type: "class",
      action: "join",
      title: "Student Joined",
      description: `${studentName} joined class ${normalizedCode}`,
      teacher_id: teacherId, // 🔥 هذا اللي بخلي النشاط يظهر للأستاذ الصح
    });

    return res.json({
      message: "Class joined successfully",
      class_id: classId,
    });
  } catch (err) {
    console.error("activateClassCode error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTeacherDashboard = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT

      -- 📘 TOTAL BOOKS
      (
        SELECT COUNT(DISTINCT ub.book_id)
        FROM user_books ub
        WHERE ub.user_id = $1
        AND ub.expires_at > NOW()
      ) AS total_books,

      -- 📚 TOTAL CLASSES
      (
        SELECT COUNT(*)
        FROM classes c
        WHERE c.teacher_id = $1
      ) AS total_classes,

      -- 👨‍🎓 TOTAL STUDENTS
      (
        SELECT COUNT(DISTINCT cs.student_id)
        FROM class_students cs
        JOIN classes c ON c.id = cs.class_id
        WHERE c.teacher_id = $1
      ) AS total_students,

      -- 📘 BOOKS CURRENT
      (
        SELECT COUNT(DISTINCT ub.book_id)
        FROM user_books ub
        WHERE ub.user_id = $1
        AND ub.expires_at > NOW()
        AND ub.activated_at >= DATE_TRUNC('month', NOW())
      ) AS books_current,

      -- 📘 BOOKS LAST
      (
        SELECT COUNT(DISTINCT ub.book_id)
        FROM user_books ub
        WHERE ub.user_id = $1
        AND ub.expires_at > NOW()
        AND ub.activated_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
        AND ub.activated_at < DATE_TRUNC('month', NOW())
      ) AS books_last,

      -- 📚 CLASSES CURRENT
      (
        SELECT COUNT(*)
        FROM classes c
        WHERE c.teacher_id = $1
        AND c.created_at >= DATE_TRUNC('month', NOW())
      ) AS classes_current,

      -- 📚 CLASSES LAST
      (
        SELECT COUNT(*)
        FROM classes c
        WHERE c.teacher_id = $1
        AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
        AND c.created_at < DATE_TRUNC('month', NOW())
      ) AS classes_last,

      -- 👨‍🎓 STUDENTS CURRENT
      (
        SELECT COUNT(DISTINCT cs.student_id)
        FROM class_students cs
        JOIN classes c ON c.id = cs.class_id
        WHERE c.teacher_id = $1
        AND cs.joined_at >= DATE_TRUNC('month', NOW())
      ) AS students_current,

      -- 👨‍🎓 STUDENTS LAST
      (
        SELECT COUNT(DISTINCT cs.student_id)
        FROM class_students cs
        JOIN classes c ON c.id = cs.class_id
        WHERE c.teacher_id = $1
        AND cs.joined_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
        AND cs.joined_at < DATE_TRUNC('month', NOW())
      ) AS students_last
      `,
      [teacherId],
    );

    const row = result.rows[0];

    const calcGrowth = (current, last) => {
      const c = Number(current) || 0;
      const l = Number(last) || 0;

      if (l === 0) return c > 0 ? 100 : 0;
      return Math.round(((c - l) / l) * 100);
    };

    res.json({
      total_books: Number(row.total_books),
      total_classes: Number(row.total_classes),
      total_students: Number(row.total_students),
      growth: {
        books: calcGrowth(row.books_current, row.books_last),
        classes: calcGrowth(row.classes_current, row.classes_last),
        students: calcGrowth(row.students_current, row.students_last),
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "error" });
  }
};
module.exports = {
  activateBookCode,
  getMyBooks,
  getMyBookById,
  addBookClass,
  activateClassCode,
  getStudentBookById,
  getTeacherDashboard,
};
