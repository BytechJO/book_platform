const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  toggleUserStatus,
  getUsersGrowth,
  getActivities,
} = require("../controller/user");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

// http://localhost:5000/api/users/all
router.get("/all-users", authenticate, authorize("admin"), getAllUsers);

// http://localhost:5000/api/users/toggle-status/:id
router.patch("/:id/status", authenticate, authorize("admin"), toggleUserStatus);
router.get("/users-growth", authenticate, authorize("admin"), getUsersGrowth);
router.get("/activities", authenticate, authorize("admin"), getActivities);
module.exports = router;
