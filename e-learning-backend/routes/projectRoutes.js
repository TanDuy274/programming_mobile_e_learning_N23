const express = require("express");
const router = express.Router();
const {
  getProjectsForCourse,
  createProject,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/:courseId").get(protect, getProjectsForCourse);
router.route("/").post(protect, createProject);

module.exports = router;
