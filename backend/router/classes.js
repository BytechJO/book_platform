const express = require("express");
const router = express.Router();

const {
  getTeacherClasses,
  getMyClassesByBook,
  getStudentClasses,
  getTeacherClassDetails,
  getStudentClassDetails,
  createClassNote,
  updateClassNote,
  deleteClassNote,
  setClassItemPinned,
} = require("../controller/classes");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

router.get(
  "/teacherClasses",
  authenticate,
  authorize("teacher"),
  getTeacherClasses,
);
router.get(
  "/teacherClasses/:classId",
  authenticate,
  authorize("teacher"),
  getTeacherClassDetails,
);
router.post(
  "/teacherClasses/:classId/notes",
  authenticate,
  authorize("teacher"),
  createClassNote,
);
router.put(
  "/teacherClasses/:classId/notes/:noteId",
  authenticate,
  authorize("teacher"),
  updateClassNote,
);
router.delete(
  "/teacherClasses/:classId/notes/:noteId",
  authenticate,
  authorize("teacher"),
  deleteClassNote,
);
router.patch(
  "/teacherClasses/:classId/items/:itemId/pin",
  authenticate,
  authorize("teacher"),
  setClassItemPinned,
);
router.get(
  "/myClassesByBook/:bookId",
  authenticate,
  authorize("teacher"),
  getMyClassesByBook,
);

router.get(
  "/student-classes",
  authenticate,
  authorize("student"),
  getStudentClasses,
);
router.get(
  "/student-classes/:classId",
  authenticate,
  authorize("student"),
  getStudentClassDetails,
);
module.exports = router;
