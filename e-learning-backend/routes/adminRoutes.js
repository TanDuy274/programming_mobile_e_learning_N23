const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Import Models
const Course = require("../models/CourseModel.js");
const Category = require("../models/CategoryModel.js");
const User = require("../models/UserModel.js");
const Enrollment = require("../models/EnrollmentModel.js"); // << THÊM MỚI
const Review = require("../models/ReviewModel.js"); // << THÊM MỚI

// --- MAIN ADMIN DASHBOARD ---
// Chuyển hướng đến trang quản lý chính là courses
router.get("/", (req, res) => {
  res.redirect("/admin/courses");
});

// --- QUẢN LÝ KHÓA HỌC ---
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name")
      .populate("category", "name");
    res.render("courses", { courses: courses });
  } catch (error) {
    res.send("Lỗi tải khóa học");
  }
});

router.get("/courses/:id/delete", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect("/admin/courses");
  } catch (error) {
    res.send("Lỗi khi xóa khóa học");
  }
});

// --- QUẢN LÝ DANH MỤC ---
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categories", { categories: categories });
  } catch (error) {
    res.send("Lỗi tải danh mục");
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    await Category.create({ name });
    res.redirect("/admin/categories");
  } catch (error) {
    res.send("Lỗi khi tạo danh mục");
  }
});

router.get("/categories/:id/delete", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories");
  } catch (error) {
    res.send("Lỗi khi xóa danh mục");
  }
});

// --- QUẢN LÝ NGƯỜI DÙNG ---
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { users: users });
  } catch (error) {
    res.send("Lỗi tải người dùng");
  }
});

router.get("/users/:id/delete", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (error) {
    res.send("Lỗi khi xóa người dùng");
  }
});

// --- QUẢN LÝ GHI DANH (ENROLLMENTS) --- << MỚI
router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name")
      .populate("course", "title");
    res.render("enrollments", { enrollments: enrollments });
  } catch (error) {
    res.send("Lỗi tải danh sách ghi danh");
  }
});

router.get("/enrollments/:id/delete", async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.redirect("/admin/enrollments");
  } catch (error) {
    res.send("Lỗi khi xóa ghi danh");
  }
});

// --- QUẢN LÝ ĐÁNH GIÁ (REVIEWS) --- << MỚI
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("course", "title");
    res.render("reviews", { reviews: reviews });
  } catch (error) {
    res.send("Lỗi tải danh sách đánh giá");
  }
});

router.get("/reviews/:id/delete", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect("/admin/reviews");
  } catch (error) {
    res.send("Lỗi khi xóa đánh giá");
  }
});

// ROUTE MỚI: Hiển thị form sửa danh mục
router.get("/categories/:id/edit", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render("edit-category", { category: category });
  } catch (error) {
    res.send("Không tìm thấy danh mục");
  }
});

// ROUTE MỚI: Xử lý cập nhật danh mục
router.post("/categories/:id/edit", async (req, res) => {
  try {
    const { name } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name: name });
    res.redirect("/admin/categories");
  } catch (error) {
    res.send("Lỗi khi cập nhật danh mục");
  }
});

// ROUTE MỚI: Hiển thị form tạo khóa học mới
router.get("/courses/new", async (req, res) => {
  try {
    const categories = await Category.find();
    const teachers = await User.find({ role: "teacher" });
    res.render("new-course", { categories, teachers });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form");
  }
});

// ROUTE MỚI: Xử lý tạo khóa học mới
router.post("/courses/new", async (req, res) => {
  try {
    const { title, description, price, instructor, category } = req.body;
    await Course.create({ title, description, price, instructor, category });
    res.redirect("/admin/courses");
  } catch (error) {
    res.send("Lỗi khi tạo khóa học");
  }
});

// ROUTE MỚI: Hiển thị form sửa khóa học
router.get("/courses/:id/edit", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const categories = await Category.find();
    const teachers = await User.find({ role: "teacher" });
    res.render("edit-course", { course, categories, teachers });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form sửa");
  }
});

// ROUTE MỚI: Xử lý cập nhật khóa học
router.post("/courses/:id/edit", async (req, res) => {
  try {
    const { title, description, price, instructor, category } = req.body;
    await Course.findByIdAndUpdate(req.params.id, {
      title,
      description,
      price,
      instructor,
      category,
    });
    res.redirect("/admin/courses");
  } catch (error) {
    res.send("Lỗi khi cập nhật khóa học");
  }
});

// ROUTE MỚI: Hiển thị form tạo người dùng mới
router.get("/users/new", (req, res) => {
  res.render("new-user");
});

// ROUTE MỚI: Xử lý tạo người dùng mới
router.post("/users/new", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Kiểm tra xem mật khẩu có được cung cấp không
    if (!password) {
      return res.send("Vui lòng cung cấp mật khẩu");
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10); // << Bỏ comment dòng này
    const hashedPassword = await bcrypt.hash(password, salt); // << Bỏ comment dòng này

    // 3. Tạo người dùng với mật khẩu đã mã hóa
    await User.create({
      name,
      email,
      password: hashedPassword, // << Sử dụng mật khẩu đã mã hóa
      role,
    });

    res.redirect("/admin/users");
  } catch (error) {
    res.send("Lỗi khi tạo người dùng (có thể do trùng email)");
  }
});

// ROUTE MỚI: Hiển thị form sửa người dùng
router.get("/users/:id/edit", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("edit-user", { user: user });
  } catch (error) {
    res.send("Không tìm thấy người dùng");
  }
});

// ROUTE MỚI: Xử lý cập nhật người dùng
router.post("/users/:id/edit", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.redirect("/admin/users");
  } catch (error) {
    res.send("Lỗi khi cập nhật người dùng");
  }
});

// --- QUẢN LÝ GHI DANH (ENROLLMENTS) ---

// ROUTE MỚI: Hiển thị form tạo ghi danh mới
router.get("/enrollments/new", async (req, res) => {
  try {
    const users = await User.find({ role: "student" });
    const courses = await Course.find();
    res.render("new-enrollment", { users, courses });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form");
  }
});

// ROUTE MỚI: Xử lý tạo ghi danh mới
router.post("/enrollments/new", async (req, res) => {
  try {
    const { user, course } = req.body;
    await Enrollment.create({ user, course });
    res.redirect("/admin/enrollments");
  } catch (error) {
    res.send("Lỗi khi tạo ghi danh (có thể do user đã ghi danh khóa này)");
  }
});

// --- QUẢN LÝ ĐÁNH GIÁ (REVIEWS) ---

// ROUTE MỚI: Hiển thị form tạo đánh giá mới
router.get("/reviews/new", async (req, res) => {
  try {
    const users = await User.find();
    const courses = await Course.find();
    res.render("new-review", { users, courses });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form");
  }
});

// ROUTE MỚI: Xử lý tạo đánh giá mới
router.post("/reviews/new", async (req, res) => {
  try {
    const { user, course, rating, comment } = req.body;
    await Review.create({ user, course, rating, comment });
    res.redirect("/admin/reviews");
  } catch (error) {
    res.send("Lỗi khi tạo đánh giá (có thể do user đã đánh giá khóa này)");
  }
});

// ROUTE MỚI: Hiển thị form sửa ghi danh
router.get("/enrollments/:id/edit", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    const users = await User.find({ role: "student" });
    const courses = await Course.find();
    res.render("edit-enrollment", { enrollment, users, courses });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form sửa ghi danh");
  }
});

// ROUTE MỚI: Xử lý cập nhật ghi danh
router.post("/enrollments/:id/edit", async (req, res) => {
  try {
    const { user, course } = req.body;
    await Enrollment.findByIdAndUpdate(req.params.id, { user, course });
    res.redirect("/admin/enrollments");
  } catch (error) {
    res.send("Lỗi khi cập nhật ghi danh");
  }
});

// ROUTE MỚI: Hiển thị form sửa đánh giá
router.get("/reviews/:id/edit", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.render("edit-review", { review });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form sửa đánh giá");
  }
});

// ROUTE MỚI: Xử lý cập nhật đánh giá
router.post("/reviews/:id/edit", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await Review.findByIdAndUpdate(req.params.id, { rating, comment });
    res.redirect("/admin/reviews");
  } catch (error) {
    res.send("Lỗi khi cập nhật đánh giá");
  }
});

module.exports = router;
