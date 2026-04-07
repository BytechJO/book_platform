const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");
const {
  createCode,
  getAllCodes,
  importCodes,
  getCodeByBookId,
  updateCodeValidity,
  deleteCode,
} = require("../controller/code");

//http://localhost:5000/api/code/create(POST)
router.post("/create", authenticate, authorize("admin"), createCode);

//http://localhost:5000/api/code/all(GET)
router.get("/all-codes", authenticate, authorize("admin"), getAllCodes);

//http://localhost:5000/api/code/:bookId(GET)
router.get("/book/:bookId", getCodeByBookId);

//http://localhost:5000/api/code/import(POST)
router.post("/import", authenticate, authorize("admin"), importCodes);

// http://localhost:5000/api/code/:id (PUT)
router.put("/:id", authenticate, authorize("admin"), updateCodeValidity);

// http://localhost:5000/api/code/:id (DELETE)
router.delete("/:id", authenticate, authorize("admin"), deleteCode);
module.exports = router;
