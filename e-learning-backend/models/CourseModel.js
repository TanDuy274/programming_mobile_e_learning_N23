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
    studentsEnrolled: { type: Number, default: 0 }, // tổng số người học
    totalDurationMinutes: { type: Number, default: 0 }, // tổng thời lượng khóa học

    // Cho “view more” / filter
    isFeatured: { type: Boolean, default: false }, // featured (hiện ở mục "Inspires")
    isPublished: { type: Boolean, default: true }, // ẩn/hiện khóa học
    tags: [{ type: String }], // từ khóa phục vụ search
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

  // Tính tổng thời lượng bài học
  if (this.lessons?.length > 0) {
    this.totalDurationMinutes = this.lessons.reduce(
      (sum, lesson) => sum + (lesson.duration || 0),
      0
    );
  } else {
    this.totalDurationMinutes = 0;
  }

  next();
});

courseSchema.index({ rating: -1 });
courseSchema.index({ reviewCount: -1 });
courseSchema.index({ isFeatured: 1 });

module.exports = mongoose.model("Course", courseSchema);
