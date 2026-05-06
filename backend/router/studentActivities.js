const express = require("express");

const router = express.Router();

const {
  getStudentActivities,
  getStudentNotifications,
} = require("../controller/studentActivities");

const { authenticate } = require("../middleware/authenticate");

router.get("/my-activities", authenticate, getStudentActivities);

router.get("/notifications", authenticate, getStudentNotifications);
module.exports = router;
