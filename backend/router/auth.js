const express = require("express");
const router = express.Router();
const { register, login ,me } = require("../controller/auth");
const { authenticate } = require("../middleware/authenticate");

//http://localhost:5000/api/auth/register(POST)
router.post("/register", register);

//http://localhost:5000/api/auth/login(POST)
router.post("/login", login);

//http://localhost:5000/api/auth/me(GET) - protected route example
router.get("/me", authenticate, me);

module.exports = router;
