// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
} = require("../controllers/enrollmentController");
const { protect } = require("../middlewares/authMiddleware");

// Route này phải đặt trước route có param (:courseId) để tránh bị nhầm lẫn
router.get("/my-courses", protect, getMyCourses);

router.post("/:courseId", protect, enrollInCourse);

module.exports = router;
