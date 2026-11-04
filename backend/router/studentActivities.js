const express = require("express");

const router = express.Router();

const {
  getStudentActivities,
  getStudentNotifications,
} = require("../controller/studentActivities");

const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

router.get(
  "/my-activities",
  authenticate,
  authorize("student"),
  getStudentActivities,
);

router.get(
  "/notifications",
  authenticate,
  authorize("student"),
  getStudentNotifications,
);
module.exports = router;
