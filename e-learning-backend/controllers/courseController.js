// controllers/courseController.js
const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const Review = require("../models/ReviewModel.js");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
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
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "User is not a teacher" });
    }

    const { title, description, price, category, lessons, thumbnail } =
      req.body;

    const titleNoAccent = removeVietnameseTones(course.title);

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const course = new Course({
      title,
      titleNoAccent,
      description,
      price,
      thumbnail,
      instructor: req.user._id,
      category,
      lessons: lessons?.map((l) => ({
        title: l.title,
        youtubeVideoId: l.youtubeVideoId,
        duration: Number(l.duration),
      })),
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error("ERROR CREATING COURSE:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getCourseById = async (req, res) => {
  try {
    const [course, reviews] = await Promise.all([
      Course.findById(req.params.id)
        .populate("instructor", "name email _id avatar")
        .populate("category", "name"),
      Review.find({ course: req.params.id })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("user", "name avatar"),
    ]);

    if (course) {
      res.status(200).json({ ...course.toObject(), reviews });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const searchCourses = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim();
    if (!keyword) return res.json([]);

    const keywordNoAccent = removeVietnameseTones(keyword);
    const regex = new RegExp(keywordNoAccent, "i");

    const courses = await Course.find({
      $or: [
        { titleNoAccent: { $regex: regex } },
        { title: { $regex: new RegExp(keyword, "i") } },
      ],
    })
      .populate("instructor", "name")
      .limit(50);

    res.json(courses);
  } catch (error) {
    console.error("searchCourses error:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

function removeVietnameseTones(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const updateCourse = async (req, res) => {
  const { title, description, price, categoryId, thumbnail, lessons } =
    req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    // Chỉ chủ sở hữu khóa học mới được sửa
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    course.title = title || course.title;
    course.titleNoAccent = removeVietnameseTones(title) || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = categoryId || course.category;
    course.thumbnail = thumbnail || course.thumbnail;
    course.lessons = lessons || course.lessons;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await course.deleteOne();
    res.json({ message: "Course removed" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
};

const getCoursesByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "Course IDs are required and must be an array." });
    }

    const courses = await Course.find({ _id: { $in: ids } }).populate(
      "instructor",
      "name"
    );

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCourses,
  createCourse,
  getCourseById,
  searchCourses,
  updateCourse,
  deleteCourse,
  getCoursesByIds,
};
