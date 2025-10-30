// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCourses,
  createCourse,
  getCourseById,
  searchCourses,
  updateCourse,
  deleteCourse,
  getCoursesByIds,
} = require("../controllers/courseController");
const { protect } = require("../middlewares/authMiddleware");
const reviewRouter = require("./reviewRoutes");

router
  .route("/")
  .get(getCourses) // Ai cũng có thể xem khóa học
  .post(protect, createCourse); // Chỉ người đã đăng nhập (và là teacher) mới được tạo

router.route("/by-ids").post(getCoursesByIds);
router.route("/search").get(searchCourses);

// Chuyển hướng các request tới /api/courses/:courseId/reviews cho reviewRouter xử lý
router.use("/:courseId/reviews", reviewRouter);
router
  .route("/:id")
  .get(getCourseById)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
