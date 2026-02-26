const express = require("express");
const router = express.Router();

const { getAllUsers, toggleUserStatus } = require("../controller/user");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

// http://localhost:5000/api/users/all
router.get("/all-users", authenticate, authorize("admin"), getAllUsers);

// http://localhost:5000/api/users/toggle-status/:id
router.patch("/:id/status", authenticate, authorize("admin"), toggleUserStatus);

module.exports = router;
