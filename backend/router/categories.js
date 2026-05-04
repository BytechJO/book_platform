const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require("../controller/categories");

const { authenticate } = require("../middleware/authenticate");
const authorize = require("../middleware/authorized");

// 🔥 Create (admin only)
router.post("/", authenticate, authorize("admin"), createCategory);

// 🔥 Get all (public)
router.get("/", getAllCategories);

// 🔥 Get by id (public)
router.get("/:id", getCategoryById);

module.exports = router;
