const express = require("express");
const router = express.Router();
const { createBook, getAllBooks, getBookById } = require("../controller/book");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

//http://localhost:5000/api/books/create(POST)
router.post("/create", authenticate, authorize("admin"), createBook);

//http://localhost:5000/api/books/all(GET)
router.get("/all-books",authenticate, authorize("admin"), getAllBooks);

//http://localhost:5000/api/books/:id(GET)
router.get("/:id", getBookById);

module.exports = router;
