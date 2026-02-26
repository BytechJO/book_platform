const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controller/user");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

// http://localhost:5000/api/users/all
router.get(
  "/all-users",
  authenticate,
  authorize("admin"),
  getAllUsers
);

module.exports = router;