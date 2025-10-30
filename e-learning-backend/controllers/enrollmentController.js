// controllers/enrollmentController.js
const Enrollment = require("../models/EnrollmentModel");
const Course = require("../models/CourseModel");
const UserModel = require("../models/UserModel");

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
      // Lấy thông tin lesson để tính tổng thời lượng khóa học
      populate: [
        {
          path: "instructor",
          select: "name",
        },
      ],
    });

    // Tính tổng thời lượng cho mỗi khóa học
    const enrollmentsWithDuration = enrollments.map((enrollment) => {
      let totalDurationMinutes = 0;
      if (enrollment.course && enrollment.course.lessons) {
        totalDurationMinutes = enrollment.course.lessons.reduce(
          (sum, lesson) => sum + (lesson.duration || 0),
          0
        );
      }
      // Chuyển đổi enrollment Mongoose documents thành plain objects
      const enrollmentObjects = enrollment.toObject();
      // Thêm trường mới vào course object bên trong enrollment
      if (enrollmentObjects.course) {
        enrollmentObjects.course.totalDurationMinutes = totalDurationMinutes;
      }
      return enrollmentObjects;
    });

    res.status(200).json(enrollmentsWithDuration);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const updateEnrollmentProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (enrollment) {
      // Đảm bảo chỉ người dùng sở hữu mới được cập nhật
      if (enrollment.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      enrollment.progress = progress;
      await enrollment.save();
      res.json(enrollment);
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Enroll all courses from user's cart
// @route   POST /api/enrollments/checkout
// @access  Private
const enrollFromCart = async (req, res) => {
  try {
    const { courseIds } = req.body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn ít nhất một khóa học để đăng ký" });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const validSelectedIds = courseIds.filter((id) => user.cart.includes(id));
    if (validSelectedIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có khóa học hợp lệ trong giỏ hàng" });
    }

    const existingEnrollments = await Enrollment.find({
      user: user._id,
      course: { $in: validSelectedIds }, // chỉ kiểm tra trong các id đã chọn
    });

    const existingCourseIds = existingEnrollments.map((e) =>
      e.course.toString()
    );

    // Lọc ra các khóa học cần đăng ký (chưa có trong enrollment)
    const coursesToEnroll = validSelectedIds.filter(
      (courseId) => !existingCourseIds.includes(courseId.toString())
    );

    if (coursesToEnroll.length === 0) {
      user.cart.pull(...validSelectedIds); // xóa các khóa đã checkout khỏi giỏ
      await user.save();
      return res.status(200).json({
        message: "Đăng ký khóa học thành công",
      });
    }

    // Tạo các bản ghi enrollment mới
    const newEnrollments = coursesToEnroll.map((courseId) => ({
      user: user._id,
      course: courseId,
    }));

    await Enrollment.insertMany(newEnrollments);

    // Xóa các khóa đã đăng ký khỏi giỏ hàng
    user.cart.pull(...coursesToEnroll);
    await user.save();

    res.status(201).json({
      message: `Đã đăng ký thành công ${coursesToEnroll.length} khóa học.`,
      enrolledCourses: coursesToEnroll,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
  updateEnrollmentProgress,
  enrollFromCart,
};
