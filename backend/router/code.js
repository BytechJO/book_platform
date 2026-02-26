const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");
const { createCode, getAllCodes } = require("../controller/code");

//http://localhost:5000/api/code/create(POST)
router.post("/create", authenticate, authorize("admin"), createCode);

//http://localhost:5000/api/code/all(GET)
router.get("/all-codes", authenticate, authorize("admin"), getAllCodes);

module.exports = router;
