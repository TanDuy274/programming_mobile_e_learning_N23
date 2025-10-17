// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;

  // 1. Lấy token từ header của request
  //    Định dạng header: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Tách lấy phần token
      token = req.headers.authorization.split(" ")[1];

      // 2. Giải mã và xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Lấy thông tin user từ ID có trong token (trừ password)
      //    và gắn vào object `req` để các route sau có thể sử dụng
      req.user = await User.findById(decoded.id).select("-password");

      // 4. Cho phép request đi tiếp tới controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
