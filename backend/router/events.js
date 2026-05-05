const express = require("express");
const router = express.Router();
const { getMyEvents, createEvent } = require("../controller/events");
const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

// GET events تبعون الأستاذ الحالي
router.get("/my-events", authenticate, authorize("teacher"), getMyEvents);

// POST create event
router.post("/create", authenticate, authorize("teacher"), createEvent);

module.exports = router;
