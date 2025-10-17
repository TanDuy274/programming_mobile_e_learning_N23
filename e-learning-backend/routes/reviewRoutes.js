// routes/reviewRoutes.js
const express = require("express");
// mergeParams=true cho phép route này truy cập vào params của route cha (VD: :courseId)
const router = express.Router({ mergeParams: true });
const {
  createCourseReview,
  getCourseReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").get(getCourseReviews).post(protect, createCourseReview);

module.exports = router;
