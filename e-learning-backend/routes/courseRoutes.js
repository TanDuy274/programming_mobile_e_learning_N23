// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const { getCourses, createCourse } = require("../controllers/courseController");
const { protect } = require("../middlewares/authMiddleware");

// Dùng cách viết gọn
router
  .route("/")
  .get(getCourses) // Ai cũng có thể xem khóa học
  .post(protect, createCourse); // Chỉ người đã đăng nhập (và là teacher) mới được tạo

module.exports = router;
