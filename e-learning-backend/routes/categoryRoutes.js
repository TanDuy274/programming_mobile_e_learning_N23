// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");

// Route để lấy tất cả categories (Public)
router.get("/", getCategories);

// Route để tạo category mới (Private, cần đăng nhập)
router.post("/", protect, createCategory);

// Cách viết gọn hơn cho cùng một route:
// router.route('/').get(getCategories).post(protect, createCategory);

module.exports = router;
