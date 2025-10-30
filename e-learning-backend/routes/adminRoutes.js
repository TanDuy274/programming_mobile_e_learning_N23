const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Course = require("../models/CourseModel.js");
const Category = require("../models/CategoryModel.js");
const User = require("../models/UserModel.js");
const Enrollment = require("../models/EnrollmentModel.js");
const Review = require("../models/ReviewModel.js");
const Project = require("../models/ProjectModel.js");
const Question = require("../models/QuestionModel.js");

router.get("/", (req, res) => {
  res.redirect("/admin/courses");
});

//QUẢN LÝ KHÓA HỌC
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

//QUẢN LÝ DANH MỤC
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

//QUẢN LÝ NGƯỜI DÙNG
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

//QUẢN LÝ GHI DANH (ENROLLMENTS)
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

//QUẢN LÝ ĐÁNH GIÁ (REVIEWS)
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

router.get("/categories/:id/edit", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render("edit-category", { category: category });
  } catch (error) {
    res.send("Không tìm thấy danh mục");
  }
});

router.post("/categories/:id/edit", async (req, res) => {
  try {
    const { name } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name: name });
    res.redirect("/admin/categories");
  } catch (error) {
    res.send("Lỗi khi cập nhật danh mục");
  }
});

router.get("/courses/new", async (req, res) => {
  try {
    const categories = await Category.find();
    const teachers = await User.find({ role: "teacher" });
    res.render("new-course", { categories, teachers });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form");
  }
});

router.post("/courses/new", async (req, res) => {
  try {
    const { title, description, price, instructor, category, thumbnail } =
      req.body;

    let lessons = [];
    if (req.body.lessons) {
      lessons = req.body.lessons.filter(
        (lesson) => lesson.title && lesson.youtubeVideoId && lesson.duration
      );
    }

    await Course.create({
      title,
      description,
      price,
      instructor,
      category,
      thumbnail,
      lessons,
    });
    res.redirect("/admin/courses");
  } catch (error) {
    res.send("Lỗi khi tạo khóa học");
  }
});

router.get("/courses/:id/edit", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name")
      .populate("category", "name");

    if (!course) {
      return res.send("Không tìm thấy khóa học");
    }

    const teachers = await User.find({ role: "teacher" }).select("name");
    const categories = await Category.find().select("name");

    res.render("edit-course", { course, categories, teachers });
  } catch (error) {
    console.error("Lỗi khi tải form sửa khóa học:", error);
    res.send("Lỗi tải dữ liệu cho form sửa");
  }
});

router.post("/courses/:id/edit", async (req, res) => {
  try {
    const { title, description, price, instructor, category, thumbnail } =
      req.body;

    let lessons = [];
    if (req.body.lessons) {
      lessons = req.body.lessons.filter(
        (lesson) => lesson.title && lesson.youtubeVideoId && lesson.duration
      );
    }
    await Course.findByIdAndUpdate(req.params.id, {
      title,
      description,
      price,
      instructor,
      category,
      thumbnail,
      lessons,
    });
    res.redirect("/admin/courses");
  } catch (error) {
    res.send("Lỗi khi cập nhật khóa học");
  }
});

router.get("/users/new", (req, res) => {
  res.render("new-user");
});

router.post("/users/new", async (req, res) => {
  try {
    const { name, email, password, role, headline } = req.body;

    const isVerified = req.body.isVerified === "on"; // Chuyển 'on' thành true
    const avatar = req.body.avatar || undefined; // Nếu avatar trống, để 'undefined' để model dùng default

    //Kiểm tra mật khẩu
    if (!password) {
      return res.send("Vui lòng cung cấp mật khẩu");
    }

    //Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Tạo đối tượng user mới
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      headline,
      isVerified,
    };

    if (avatar) {
      newUser.avatar = avatar; // Chỉ thêm avatar nếu được cung cấp
    }

    //Tạo người dùng
    await User.create(newUser);

    res.redirect("/admin/users");
  } catch (error) {
    res.send("Lỗi khi tạo người dùng (có thể do trùng email)");
  }
});

router.get("/users/:id/edit", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("edit-user", { user: user });
  } catch (error) {
    res.send("Không tìm thấy người dùng");
  }
});

router.post("/users/:id/edit", async (req, res) => {
  try {
    const { name, email, role, headline, avatar, password } = req.body;
    const isVerified = req.body.isVerified === "on"; // Chuyển 'on' (từ checkbox) thành true

    const updateData = {
      name,
      email,
      role,
      headline,
      avatar,
      isVerified,
    };

    //Chỉ cập nhật mật khẩu nếu admin nhập mật khẩu mới
    if (password && password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    //Cập nhật người dùng
    await User.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/users");
  } catch (error) {
    res.send("Lỗi khi cập nhật người dùng (có thể do trùng email)");
  }
});

router.get("/enrollments/new", async (req, res) => {
  try {
    const users = await User.find({ role: "student" });
    const courses = await Course.find();
    res.render("new-enrollment", { users, courses });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form");
  }
});

router.post("/enrollments/new", async (req, res) => {
  try {
    const { user, course } = req.body;
    await Enrollment.create({ user, course });
    res.redirect("/admin/enrollments");
  } catch (error) {
    res.send("Lỗi khi tạo ghi danh (có thể do user đã ghi danh khóa này)");
  }
});

router.get("/reviews/new", async (req, res) => {
  try {
    const users = await User.find();
    const courses = await Course.find();
    res.render("new-review", { users, courses });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form");
  }
});

router.post("/reviews/new", async (req, res) => {
  try {
    const { user, course, rating, comment } = req.body;
    await Review.create({ user, course, rating, comment });
    res.redirect("/admin/reviews");
  } catch (error) {
    res.send("Lỗi khi tạo đánh giá (có thể do user đã đánh giá khóa này)");
  }
});

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

router.post("/enrollments/:id/edit", async (req, res) => {
  try {
    const { user, course, progress } = req.body;
    await Enrollment.findByIdAndUpdate(req.params.id, {
      user,
      course,
      progress,
    });
    res.redirect("/admin/enrollments");
  } catch (error) {
    res.send("Lỗi khi cập nhật ghi danh");
  }
});

router.get("/reviews/:id/edit", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.render("edit-review", { review });
  } catch (error) {
    res.send("Lỗi tải dữ liệu cho form sửa đánh giá");
  }
});

router.post("/reviews/:id/edit", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await Review.findByIdAndUpdate(req.params.id, { rating, comment });
    res.redirect("/admin/reviews");
  } catch (error) {
    res.send("Lỗi khi cập nhật đánh giá");
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name")
      .populate("course", "title");
    res.render("projects", { projects: projects });
  } catch (error) {
    res.send("Lỗi khi tải danh sách dự án");
  }
});

router.get("/projects/:id/delete", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/admin/projects");
  } catch (error) {
    res.send("Lỗi khi xóa dự án");
  }
});

router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "name")
      .populate("course", "title");
    res.render("questions", { questions: questions });
  } catch (error) {
    res.send("Lỗi khi tải danh sách câu hỏi");
  }
});

router.get("/questions/:id/delete", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect("/admin/questions");
  } catch (error) {
    res.send("Lỗi khi xóa câu hỏi");
  }
});

module.exports = router;
