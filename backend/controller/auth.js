const bcrypt = require("bcrypt");
const pool = require("../database/connection");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // 1) Validation
    if (!email || !password || !full_name ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // 2) Check existing user (Postgres uses $1 not ?)
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // 3) Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // 4) Insert user
    const inserted = await pool.query(
      `INSERT INTO users (email, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, full_name, "admin"],
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: inserted.rows[0],
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2) Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // 3) Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4) Create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, email, full_name, role FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, me };
