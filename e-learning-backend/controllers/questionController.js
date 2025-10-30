const Question = requre("../models/QuestionModel");

// @desc    Lấy tất cả câu hỏi của một khóa học
// @route   GET /api/questions/:courseId
// @access  Private
const getQuestionsByCourse = async (req, res) => {
  try {
    const questions = await Question.find({ course: req.params.courseId })
      .populate("user", "name")
      .sort({ createAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Tạo một câu hỏi mới
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { courseId, text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Nội dung câu hỏi không được để trống" });
    }

    const question = new Question({
      course: courseId,
      text,
      user: req.user._id,
    });

    const createdQuestion = await question.save();
    const populatedQuestion = await Question.findById(
      createdQuestion._id
    ).populate("user", "name");

    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getQuestionsByCourse,
  createQuestion,
};
