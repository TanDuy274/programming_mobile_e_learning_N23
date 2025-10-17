// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Route đăng ký
router.post("/register", registerUser);

// Route đăng nhập
router.post("/login", loginUser);

module.exports = router;
