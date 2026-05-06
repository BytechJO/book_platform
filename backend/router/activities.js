// routes/activities.js
const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  markAllActivitiesAsRead,
  getMyNotifications,
} = require("../controller/activities");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

router.get("/all", authenticate, authorize("admin"), getAllActivities);
router.post("/read-all", authenticate, markAllActivitiesAsRead);
router.get("/notifications", authenticate, getMyNotifications);
module.exports = router;
