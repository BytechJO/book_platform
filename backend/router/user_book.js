const express = require("express");
const router = express.Router();
const { activateBookCode, getMyBooks,getMyBookById } = require("../controller/user_book");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

//http://localhost:5000/api/user-books/create(POST)
router.post(
  "/create",
  authenticate,

  activateBookCode,
);

// GET /api/user-books/my-books
router.get("/my-books", authenticate, getMyBooks);
router.get("/my-books/:bookId", authenticate, getMyBookById);
module.exports = router;
