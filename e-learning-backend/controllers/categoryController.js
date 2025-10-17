// controllers/categoryController.js
const Category = require("../models/CategoryModel");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (sau này có thể đổi thành Admin)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    // Xử lý lỗi nếu tên danh mục bị trùng
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
