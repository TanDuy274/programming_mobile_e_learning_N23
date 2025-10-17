// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Route đăng ký
router.post("/register", registerUser);
// Route đăng nhập
router.post("/login", loginUser);
// Khi có request GET tới /me, nó sẽ chạy qua middleware `protect` trước
// Nếu token hợp lệ, `protect` sẽ gọi `next()` và hàm `getMe` sẽ được thực thi.
router.get("/me", protect, getMe);

module.exports = router;
