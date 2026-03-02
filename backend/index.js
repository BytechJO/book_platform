require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database/connection");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//  Import and use auth routes
const authRouter = require("./router/auth");
app.use("/api/auth", authRouter);

// Import and use book routes
const bookRouter = require("./router/book");
app.use("/api/books", bookRouter);

// Import and use code routes
const codeRouter = require("./router/code");
app.use("/api/code", codeRouter);

// Import and use user routes
const userRouter = require("./router/user");
app.use("/api/users", userRouter);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Book Platform API Running 🚀",
      dbTime: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ error: "Database not connected" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
