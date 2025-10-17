// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Import hàm kết nối DB
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const path = require("path"); // Cần cho EJS
const { fileURLToPath } = require("url"); // Cần cho EJS
const adminRoutes = require("./routes/adminRoutes.js");

// Load biến môi trường từ file .env
dotenv.config();

// Kết nối tới MongoDB
connectDB();

// Khởi tạo app Express
const app = express();

// --- Cấu hình EJS ---
app.set("views", path.join(__dirname, "views")); // Dùng __dirname trực tiếp
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// --- Hết cấu hình EJS ---

// Sử dụng các middleware
app.use(cors()); // Cho phép các domain khác gọi tới API
app.use(express.json()); // Giúp server đọc được dữ liệu JSON từ request body

// Tạo một API endpoint (route) đơn giản để test
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/admin", adminRoutes); // Route cho trang Admin
// Dùng các routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Lấy PORT từ biến môi trường, nếu không có thì mặc định là 5000
const PORT = process.env.PORT || 5001;

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
