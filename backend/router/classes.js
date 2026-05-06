const express = require("express");
const router = express.Router();

const {
  getTeacherClasses,
  getMyClassesByBook,
  getStudentClasses,
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
module.exports = router;
