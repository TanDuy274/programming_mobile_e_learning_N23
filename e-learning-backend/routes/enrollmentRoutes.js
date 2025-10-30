const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  updateEnrollmentProgress,
  enrollFromCart,
} = require("../controllers/enrollmentController");
const { protect } = require("../middlewares/authMiddleware");

// Route để lấy danh sách các khóa học đã ghi danh
router.get("/my-courses", protect, getMyCourses);

router.route("/checkout").post(protect, enrollFromCart);
// Route để ghi danh vào một khóa học
router.post("/:courseId", protect, enrollInCourse);

// << 2. THÊM ROUTE MỚI ĐỂ CẬP NHẬT TIẾN ĐỘ >>
router.put("/:enrollmentId/progress", protect, updateEnrollmentProgress);
module.exports = router;
