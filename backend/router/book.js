const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
} = require("../controller/book");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");
const upload = require("../middleware/upload");

//http://localhost:5000/api/books/create(POST)
router.post(
  "/create",
  authenticate,
  authorize("admin"),
  upload.fields([
    { name: "cover_short", maxCount: 1 },
    { name: "cover_long", maxCount: 1 },
  ]),
  createBook,
);

//http://localhost:5000/api/books/all(GET)
router.get("/all-books", authenticate, authorize("admin"), getAllBooks);

//http://localhost:5000/api/books/:id(GET)
router.get("/:id", getBookById);

//http://localhost:5000/api/books/:id(DELETE)
router.delete("/:id/delete", authenticate, authorize("admin"), deleteBook);

//http://localhost:5000/api/books/:id/update(PUT)
router.put(
  "/:id/update",
  upload.fields([
    { name: "cover_short", maxCount: 1 },
    { name: "cover_long", maxCount: 1 },
  ]),
  authenticate,
  authorize("admin"),
  updateBook,
);

module.exports = router;
