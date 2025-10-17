// controllers/reviewController.js
const Review = require("../models/ReviewModel");
const Course = require("../models/CourseModel");
const Enrollment = require("../models/EnrollmentModel");

// @desc    Create a new review for a course
// @route   POST /api/courses/:courseId/reviews
// @access  Private
const createCourseReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;
    const userId = req.user._id;

    // 1. Kiểm tra xem user đã ghi danh khóa học này chưa
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });
    if (!enrollment) {
      return res
        .status(403)
        .json({
          message: "You must be enrolled in this course to leave a review",
        });
    }

    // 2. Tạo review
    const review = await Review.create({
      user: userId,
      course: courseId,
      rating,
      comment,
    });

    // (Optional but good practice) Cập nhật lại rating trung bình của khóa học
    const course = await Course.findById(courseId);
    const reviews = await Review.find({ course: courseId });

    course.reviewCount = reviews.length;
    course.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await course.save();

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId }).populate(
      "user",
      "name avatar"
    ); // Lấy tên và avatar của người review

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createCourseReview,
  getCourseReviews,
};
