const express = require("express");
const router = express.Router();
const {
  getQuestionsForCourse,
  createQuestion,
} = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/:courseId").get(protect, getQuestionsForCourse);
router.route("/").post(protect, createQuestion);

module.exports = router;
