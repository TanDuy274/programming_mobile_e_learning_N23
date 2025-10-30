const express = require("express");
const router = express.Router();
const {
  updateUserProfile,
  getTeacherDetails,
  getTopTeachers,
  toggleSaveCourse,
  addToCart,
  getCartItems,
  removeFromCart,
  toggleFollowTeacher,
} = require("../controllers/userController.js");
const { protect } = require("../middlewares/authMiddleware.js");

router.route("/profile").put(protect, updateUserProfile);
router.route("/teachers").get(getTopTeachers);
router.route("/save-course").put(protect, toggleSaveCourse);
router.route("/cart").get(protect, getCartItems);
router.route("/cart").post(protect, addToCart);
router.route("/teacher/:id").get(getTeacherDetails);
router.route("/cart/:courseId").delete(protect, removeFromCart);
router.route("/follow/:teacherId").post(protect, toggleFollowTeacher);

module.exports = router;
