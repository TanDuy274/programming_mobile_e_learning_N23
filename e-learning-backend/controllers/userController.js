const User = require("../models/UserModel.js");
const Course = require("../models/CourseModel.js");

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.headline = req.body.headline || user.headline;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      headline: updatedUser.headline,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get public profile of a teacher
// @route   GET /api/users/teacher/:id
// @access  Public
const getTeacherDetails = async (req, res) => {
  try {
    const [teacher, courses] = await Promise.all([
      User.findById(req.params.id).select("-password"),
      Course.find({ instructor: req.params.id }).populate("category", "name"),
    ]);

    if (teacher && teacher.role === "teacher") {
      res.json({ teacher, courses });
    } else {
      res.status(404).json({ message: "Teacher not found" });
    }
  } catch (error) {
    console.error(">>> BACKEND CRASHED:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTopTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).limit(4);
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleSaveCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem khóa học đã được lưu chưa
    const courseIndex = user.savedCourses.indexOf(courseId);

    if (courseIndex === -1) {
      // Nếu chưa có, thêm vào
      user.savedCourses.push(courseId);
    } else {
      // Nếu đã có, xóa đi
      user.savedCourses.splice(courseIndex, 1);
    }

    await user.save();
    res.json(user.savedCourses); // Trả về danh sách ID các khóa học đã lưu
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a course to cart
// @route   POST /api/users/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart) {
      user.cart = [];
    }

    // Kiểm tra xem khóa học đã có trong giỏ hàng chưa
    const courseIndex = user.cart.indexOf(courseId);

    if (courseIndex === -1) {
      // Nếu chưa có, thêm vào
      user.cart.push(courseId);
      await user.save();
      res
        .status(201)
        .json({ message: "Course added to cart", cart: user.cart });
    } else {
      // Nếu đã có
      res.status(400).json({ message: "Course already in cart" });
    }
  } catch (error) {
    console.error("LỖI addToCart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all courses in user's cart
// @route   GET /api/users/cart
// @access  Private
const getCartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart",
      // Lấy thêm thông tin của giảng viên trong khóa học
      populate: { path: "instructor", select: "name" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart); // Trả về mảng các khóa học đầy đủ
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Remove a course from cart
// @route   DELETE /api/users/cart/:courseId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Dùng .pull() để xóa phần tử ra khỏi mảng cart
    user.cart.pull(courseId);

    await user.save();

    res.json({ message: "Course removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Follow or unfollow a teacher
// @route   POST /api/users/follow/:teacherId
// @access  Private
const toggleFollowTeacher = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetTeacherId = req.params.teacherId;

    // 1. Validation: Không thể tự follow chính mình
    if (currentUserId.toString() === targetTeacherId.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự theo dõi mình" });
    }

    // 2. Tìm cả 2 user
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetTeacherId),
    ]);

    // 3. Validation: Kiểm tra user có tồn tại và có phải là giáo viên không
    if (!currentUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    if (!targetUser || targetUser.role !== "teacher") {
      return res.status(404).json({ message: "Không tìm thấy giáo viên" });
    }

    // 4. Kiểm tra xem đã follow chưa (dùng .includes() cho mảng ObjectId)
    const isFollowing = currentUser.following.includes(targetTeacherId);
    let message = "";

    if (isFollowing) {
      // --- UNFOLLOW ---
      // Xóa teacherId khỏi mảng following của currentUser
      currentUser.following.pull(targetTeacherId);
      // Xóa currentUserId khỏi mảng followers của targetUser
      targetUser.followers.pull(currentUserId);
      message = "Đã bỏ theo dõi giáo viên";
    } else {
      // --- FOLLOW ---
      // Thêm teacherId vào mảng following của currentUser
      currentUser.following.push(targetTeacherId);
      // Thêm currentUserId vào mảng followers của targetUser
      targetUser.followers.push(currentUserId);
      message = "Đã theo dõi giáo viên thành công";
    }

    // 5. Lưu cả hai
    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      message,
      following: currentUser.following, // Trả về danh sách following mới
    });
  } catch (error) {
    console.error("LỖI toggleFollowTeacher:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  updateUserProfile,
  getTeacherDetails,
  getTopTeachers,
  toggleSaveCourse,
  addToCart,
  getCartItems,
  removeFromCart,
  toggleFollowTeacher,
};
