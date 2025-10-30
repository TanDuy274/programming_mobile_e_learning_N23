const Project = requre("../models/ProjectModel");

// @desc    Lấy tất cả dự án của một khóa học
// @route   GET /api/projects/:courseId
// @access  Private
const getProjectsByCourse = async (req, res) => {
  try {
    const projects = await Project.find({ course: req.params.courseId })
      .populate("user", "name")
      .sort({ createAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Tạo một dự án mới
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { courseId, description } = req.body;
    const project = new Project({
      course: courseId,
      description,
      user: req.user._id,
    });
    const createdProject = await project.save();
    const populatedProject = await Project.findById(
      createdProject._id
    ).populate("user", "name");
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getProjectsByCourse,
  createProject,
};
