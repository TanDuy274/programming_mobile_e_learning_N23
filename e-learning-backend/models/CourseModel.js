const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    // tính bằng phút
    type: Number,
    required: true,
  },
  youtubeVideoId: {
    type: String,
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
    titleNoAccent: {
      type: String,
      index: true,
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

function removeVietnameseTones(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

courseSchema.pre("save", function (next) {
  if (this.title) {
    this.titleNoAccent = removeVietnameseTones(this.title);
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
