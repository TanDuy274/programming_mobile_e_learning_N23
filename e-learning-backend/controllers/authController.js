// controllers/authController.js
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // 2. Kiểm tra xem user đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Tạo user mới trong database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Nếu tạo user thành công, tạo token và trả về cho client
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d", // Token hết hạn sau 30 ngày
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra email và password có được gửi lên không
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // 2. Tìm user trong database bằng email
    const user = await User.findOne({ email });

    // 3. Nếu user tồn tại, so sánh mật khẩu
    //    bcrypt.compare sẽ so sánh mật khẩu người dùng gửi lên với mật khẩu đã mã hóa trong DB
    if (user && (await bcrypt.compare(password, user.password))) {
      // Mật khẩu khớp, tạo token mới
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Trả về thông tin user và token
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      // User không tồn tại hoặc sai mật khẩu
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const getMe = async (req, res) => {
  // Nhờ có middleware `protect`, chúng ta đã có `req.user`
  // chỉ cần gửi nó về cho client là xong.
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
