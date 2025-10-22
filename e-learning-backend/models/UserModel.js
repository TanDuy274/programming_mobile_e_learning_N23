// models/UserModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"], // Bắt buộc phải có tên
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // Email không được trùng
      match: [
        // Kiểm tra định dạng email hợp lệ
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6, // Mật khẩu tối thiểu 6 ký tự
    },
    role: {
      type: String,
      enum: ["student", "teacher"], // Vai trò chỉ có thể là student hoặc teacher
      default: "student",
    },
    savedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm 2 trường createdAt và updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
