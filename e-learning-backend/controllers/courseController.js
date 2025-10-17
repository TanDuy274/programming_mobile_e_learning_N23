// controllers/courseController.js
const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    // .populate('instructor', 'name') sẽ lấy thông tin của instructor từ bảng User, chỉ lấy trường 'name'
    // .populate('category', 'name') tương tự, lấy tên của category
    const courses = await Course.find({})
      .populate("instructor", "name")
      .populate("category", "name");

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Chỉ cho Teacher)
const createCourse = async (req, res) => {
  try {
    // Middleware `protect` đã gắn thông tin user vào `req.user`
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "User is not a teacher" });
    }

    const { title, description, price, categoryId, lessons } = req.body;

    // Kiểm tra xem category có tồn tại không
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const course = new Course({
      title,
      description,
      price,
      instructor: req.user._id, // Lấy ID của teacher đang đăng nhập
      category: categoryId,
      lessons,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getCourses,
  createCourse,
};
