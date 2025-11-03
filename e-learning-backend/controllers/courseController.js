// controllers/courseController.js
const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const Review = require("../models/ReviewModel");

// ===== Helpers =====
function removeVietnameseTones(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const buildSearchFilter = (q) => {
  if (!q) return {};
  const qTrim = q.trim();
  if (!qTrim) return {};
  const qNoAccent = removeVietnameseTones(qTrim);
  return {
    $or: [
      { titleNoAccent: { $regex: new RegExp(qNoAccent, "i") } },
      { title: { $regex: new RegExp(qTrim, "i") } },
      { tags: { $in: [new RegExp(qTrim, "i")] } },
    ],
  };
};

const buildSort = (sort) => {
  switch (sort) {
    case "popular":
      return { reviewCount: -1, rating: -1, createdAt: -1 };
    case "recommended":
      return { rating: -1, reviewCount: -1, createdAt: -1 };
    case "featured":
      // sẽ kết hợp với query.isFeatured = true bên dưới
      return { rating: -1, reviewCount: -1, createdAt: -1 };
    case "students":
      return { studentsEnrolled: -1, createdAt: -1 };
    case "durationDesc":
      return { totalDurationMinutes: -1 };
    case "durationAsc":
      return { totalDurationMinutes: 1 };
    case "priceAsc":
      return { price: 1 };
    case "priceDesc":
      return { price: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

// ===== Controllers =====

// @desc    Get all courses (paging/filter/sort)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      categoryId,
      instructorId,
      minPrice,
      maxPrice,
      q,
      featured, // "1" => chỉ lấy featured
      published, // "0" hoặc "1" (mặc định "1")
      tags, // "react,js,node"
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Published mặc định = true (ẩn khóa nháp)
    if (published === "0") query.isPublished = false;
    else query.isPublished = true;

    if (categoryId) query.category = categoryId;
    if (instructorId) query.instructor = instructorId;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === "1") query.isFeatured = true;

    // Lọc theo tags (danh sách tag, phân tách dấu phẩy)
    if (tags) {
      const arr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (arr.length) query.tags = { $in: arr };
    }

    Object.assign(query, buildSearchFilter(q));

    const sortOption = buildSort(sort);

    const [docs, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name avatar")
        .populate("category", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(query),
    ]);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
      docs,
    });
  } catch (error) {
    console.error("getCourses error:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher)
const createCourse = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "User is not a teacher" });
    }

    const {
      title,
      description,
      price,
      category,
      lessons,
      thumbnail,
      isFeatured,
      isPublished,
      tags,
    } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const titleNoAccent = removeVietnameseTones(title);

    const normalizedLessons = (lessons || []).map((l) => ({
      title: l.title,
      youtubeVideoId: l.youtubeVideoId,
      duration: Number(l.duration),
    }));

    const course = new Course({
      title,
      titleNoAccent,
      description,
      price,
      thumbnail,
      instructor: req.user._id,
      category,
      lessons: normalizedLessons,
      isFeatured: !!isFeatured,
      isPublished: isPublished === undefined ? true : !!isPublished,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : [],
    });

    // Nếu muốn chắc ăn trước khi pre-save tính:
    course.totalDurationMinutes = normalizedLessons.reduce(
      (sum, l) => sum + (Number(l.duration) || 0),
      0
    );

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error("ERROR CREATING COURSE:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get course by id + latest 3 reviews
// @route   GET /api/courses/:id
// @access  Public
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

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ ...course.toObject(), reviews });
  } catch (error) {
    console.error("getCourseById error:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Quick search (no paging) - dùng cho ô search gợi ý
// @route   GET /api/courses/search?keyword=...
// @access  Public
const searchCourses = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim();
    if (!keyword) return res.json([]);

    const keywordNoAccent = removeVietnameseTones(keyword);
    const regexNoAccent = new RegExp(keywordNoAccent, "i");
    const regexRaw = new RegExp(keyword, "i");

    const courses = await Course.find({
      $or: [
        { titleNoAccent: { $regex: regexNoAccent } },
        { title: { $regex: regexRaw } },
        { tags: { $in: [regexRaw] } },
      ],
      isPublished: true,
    })
      .populate("instructor", "name")
      .limit(50);

    res.json(courses);
  } catch (error) {
    console.error("searchCourses error:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (owner)
const updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      thumbnail,
      lessons,
      isFeatured,
      isPublished,
      tags,
    } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Chỉ owner (teacher tạo khóa) mới được sửa
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (title) {
      course.title = title;
      course.titleNoAccent = removeVietnameseTones(title);
    }
    if (description !== undefined) course.description = description;
    if (price !== undefined) course.price = price;

    if (category) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: "Category not found" });
      course.category = category;
    }

    if (thumbnail !== undefined) course.thumbnail = thumbnail;

    if (Array.isArray(lessons)) {
      course.lessons = lessons.map((l) => ({
        title: l.title,
        youtubeVideoId: l.youtubeVideoId,
        duration: Number(l.duration),
      }));
    }

    if (isFeatured !== undefined) course.isFeatured = !!isFeatured;
    if (isPublished !== undefined) course.isPublished = !!isPublished;

    if (tags !== undefined) {
      course.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : [];
    }

    // cập nhật tổng thời lượng
    course.totalDurationMinutes = (course.lessons || []).reduce(
      (sum, l) => sum + (Number(l.duration) || 0),
      0
    );

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error("updateCourse error:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (owner)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await course.deleteOne();
    res.json({ message: "Course removed" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get courses by ids (giỏ hàng / saved list)
// @route   POST /api/courses/by-ids
// @access  Public
const getCoursesByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Course IDs are required and must be a non-empty array.",
      });
    }

    const courses = await Course.find({ _id: { $in: ids } })
      .populate("instructor", "name")
      .lean();

    res.json(courses);
  } catch (error) {
    console.error("getCoursesByIds error:", error);
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
