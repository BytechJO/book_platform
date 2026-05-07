const express = require("express");
const router = express.Router();
const {
  getMyEvents,
  createEvent,
  getStudentEvents,
  updateEvent,
  deleteEvent,
} = require("../controller/events");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

// GET events تبعون الأستاذ الحالي
router.get("/my-events", authenticate, authorize("teacher"), getMyEvents);

// POST create event
router.post("/create", authenticate, authorize("teacher"), createEvent);
router.get(
  "/student-events",
  authenticate,
  authorize("student"),
  getStudentEvents,
);
router.put("/:id", authenticate, authorize("teacher"), updateEvent);
router.delete("/:id", authenticate, authorize("teacher"), deleteEvent);
module.exports = router;
