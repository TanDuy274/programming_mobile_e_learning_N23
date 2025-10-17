// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const { getCourses, createCourse } = require("../controllers/courseController");
const { protect } = require("../middlewares/authMiddleware");
const reviewRouter = require("./reviewRoutes");

// Dùng cách viết gọn
router
  .route("/")
  .get(getCourses) // Ai cũng có thể xem khóa học
  .post(protect, createCourse); // Chỉ người đã đăng nhập (và là teacher) mới được tạo

// Chuyển hướng các request tới /api/courses/:courseId/reviews cho reviewRouter xử lý
router.use("/:courseId/reviews", reviewRouter);

module.exports = router;
