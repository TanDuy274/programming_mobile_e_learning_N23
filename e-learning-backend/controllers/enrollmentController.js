// controllers/enrollmentController.js
const Enrollment = require("../models/EnrollmentModel");
const Course = require("../models/CourseModel");

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student)
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id; // Lấy từ middleware `protect`

    // 1. Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Tạo một bản ghi enrollment mới
    //    Lỗi trùng lặp (nếu user đã enroll) sẽ được bắt ở khối catch
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    // Xử lý lỗi nếu user đã enroll rồi
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already enrolled in this course" });
    }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get my enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "name", // Lấy tên của instructor
      },
    });

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
};
