const express = require("express");
const router = express.Router();

const {
  getTeacherClasses,
  getMyClassesByBook,
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
module.exports = router;
