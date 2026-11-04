const express = require("express");

const router = express.Router();

const {
  getTeacherActivities,
  getTeacherNotifications,
} = require("../controller/teacherActivities");

const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

router.get(
  "/my-activities",
  authenticate,
  authorize("teacher"),
  getTeacherActivities,
);
router.get(
  "/notifications",
  authenticate,
  authorize("teacher"),
  getTeacherNotifications,
);
module.exports = router;
