// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

// Khi có request POST tới /api/auth/register, hàm registerUser sẽ được gọi
router.post("/register", registerUser);

module.exports = router;
