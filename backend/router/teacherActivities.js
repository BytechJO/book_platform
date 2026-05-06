const express = require("express");

const router = express.Router();

const {
  getTeacherActivities,
  getTeacherNotifications,
} = require("../controller/teacherActivities");

const { authenticate } = require("../middleware/authenticate");

router.get("/my-activities", authenticate, getTeacherActivities);
router.get("/notifications", authenticate, getTeacherNotifications);
module.exports = router;
