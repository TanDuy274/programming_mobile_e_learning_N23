// models/CourseModel.js
const mongoose = require("mongoose");

// Đây là một "Schema con" (subdocument), nó sẽ được nhúng vào trong Course.
// Nó không phải là một model riêng biệt.
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // videoUrl: { type: String, required: true }, // Bạn có thể thêm sau khi có hệ thống upload
  duration: {
    // tính bằng phút
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a course title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    thumbnail: {
      type: String,
      default: "no-photo.jpg", // Ảnh mặc định
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId, // Đây là cách tạo mối quan hệ
      ref: "User", // Tham chiếu đến model 'User'
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Tham chiếu đến model 'Category'
      required: true,
    },
    lessons: [lessonSchema], // Một mảng các bài học
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
