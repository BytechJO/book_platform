const express = require("express");
const router = express.Router();
const {
  activateBookCode,
  getMyBooks,
  getMyBookById,
  addBookClass,
  activateClassCode,
  getStudentBookById,
} = require("../controller/user_book");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

//http://localhost:5000/api/user-books/create(POST)
router.post(
  "/create",
  authenticate,

  activateBookCode,
);

// GET /api/user-books/my-books
router.get(
  "/my-books",
  authenticate,
  authorize("teacher", "student"),
  getMyBooks,
);
router.get(
  "/my-books/:bookId",
  authenticate,
  authorize("teacher", "student"),
  getMyBookById,
);

router.post("/:id/class", authenticate, authorize("teacher"), addBookClass);

router.post(
  "/:id/class/student",
  authenticate,
  authorize("student"),
  activateClassCode,
);

router.get(
  "/student/:bookId",
  authenticate,
  authorize("student"),
  getStudentBookById,
);
module.exports = router;
