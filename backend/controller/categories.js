const pool = require("../database/connection");
const logActivity = require("../utils/activityLogger");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const exists = await pool.query(
      "SELECT id FROM categories WHERE LOWER(name) = LOWER($1)",
      [name.trim()],
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name.trim()],
    );

    const createdCategory = result.rows[0];

    // 🔥 Activity Log
    try {
      await logActivity({
        type: "category",
        action: "created",
        title: "New category created",
        description: `Category "${createdCategory.name}" added`,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    res.status(201).json(createdCategory);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC",
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get category error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
};
