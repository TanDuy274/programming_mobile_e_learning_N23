/**
 * Seed dữ liệu E-Learning (Category, User, Course, Enrollment, Review, Question, Project)
 * Cách chạy:
 *   1) Đặt file ở gốc backend, đảm bảo đã cài dotenv và có MONGO_URI trong .env
 *   2) node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Category = require("./models/CategoryModel");
const Course = require("./models/CourseModel");
const Enrollment = require("./models/EnrollmentModel");
const Review = require("./models/ReviewModel");
const Question = require("./models/QuestionModel");
const Project = require("./models/ProjectModel");
const User = require("./models/UserModel");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const salt = await bcrypt.genSalt(10);
  console.log("✅ Connected to MongoDB");

  // XÓA DỮ LIỆU CŨ (an toàn cho môi trường dev)
  await Promise.all([
    Category.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    Review.deleteMany({}),
    Question.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log("🧹 Cleared old data");

  // 1) CATEGORY
  const categories = await Category.insertMany([
    { name: "Lập trình Web" },
    { name: "React Native" },
    { name: "Khoa học dữ liệu" },
    { name: "Thiết kế UI/UX" },
    { name: "DevOps" },
    { name: "Hệ quản trị CSDL" },
  ]);
  const cat = Object.fromEntries(categories.map((c) => [c.name, c]));
  console.log(`📚 Inserted ${categories.length} categories`);

  // 2) USERS (teachers & students)
  const users = await User.insertMany([
    // Teachers
    {
      name: "Trần Minh Khôi",
      email: "khoi.teacher@example.com",
      password: await bcrypt.hash("123456", salt), // đặt hash thật ở prod
      role: "teacher",
      headline: "Fullstack Engineer • React / Node.js",
      isVerified: true,
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Nguyễn Thu Hà",
      email: "ha.teacher@example.com",
      password: await bcrypt.hash("123456", salt),
      role: "teacher",
      headline: "Mobile Dev • React Native / Expo",
      isVerified: true,
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      name: "Phạm Quốc Duy",
      email: "duy.teacher@example.com",
      password: await bcrypt.hash("123456", salt),
      role: "teacher",
      headline: "Data Scientist • Python / ML",
      isVerified: true,
      avatar: "https://i.pravatar.cc/150?img=22",
    },
    {
      name: "Lê Bảo Anh",
      email: "anh.teacher@example.com",
      password: await bcrypt.hash("123456", salt),
      role: "teacher",
      headline: "DevOps • Docker / CI-CD",
      isVerified: true,
      avatar: "https://i.pravatar.cc/150?img=45",
    },

    // Students
    {
      name: "Nguyễn Trung Hậu",
      email: "hau.student@example.com",
      password: await bcrypt.hash("123456", salt),
      role: "student",
      headline: "Sinh viên CNTT, thích Mobile + Backend",
      isVerified: true,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Phạm Thị Linh",
      email: "linh.student@example.com",
      password: await bcrypt.hash("123456", salt),
      role: "student",
      headline: "Sinh viên năm 3, quan tâm Data",
      isVerified: true,
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      name: "Võ Hoàng Nam",
      email: "nam.student@example.com",
      password: await bcrypt.hash("123456", salt),
      role: "student",
      headline: "Front-end lover",
      isVerified: false,
      avatar: "https://i.pravatar.cc/150?img=7",
    },
  ]);
  const U = Object.fromEntries(users.map((u) => [u.email, u]));
  console.log(`👥 Inserted ${users.length} users`);

  // 3) COURSES (với lessons có youtubeVideoId & duration)
  // Lưu ý: youtubeVideoId là ID video, không phải URL. Dùng ID public phổ biến để demo.
  // (Bạn có thể thay bằng video nội bộ của team bạn sau)
  const coursesPayload = [
    {
      title: "Tự học lập trình React Native từ A đến Z",
      description:
        "Học React Native từ đầu: Component, Hooks, Navigation, State Management, API, build Android/iOS với Expo.",
      thumbnail:
        "https://tse4.mm.bing.net/th/id/OIP.cSDx8o7nBmaJjCs4EywrfAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      price: 70,
      instructor: U["ha.teacher@example.com"]._id,
      category: cat["React Native"]._id,
      lessons: [
        {
          title:
            "Tự học lập trình React Native - Bài 1: Giới thiệu React Native",
          duration: 4,
          youtubeVideoId: "atPKL_H0wxY",
        },
        {
          title: "Tự học lập trình React Native - Bài 2: Cài đặt môi trường",
          duration: 13,
          youtubeVideoId: "dxFM9vIaOiE&",
        },
        {
          title: "Tự học lập trình React Native - Bài 3: Khởi chạy ứng dụng",
          duration: 8,
          youtubeVideoId: "9l5gWkHxu_0",
        },
        {
          title: "Tự học lập trình React Native - Bài 4: Basic UI components",
          duration: 7,
          youtubeVideoId: "MG1bv16VOg0",
        },
        {
          title: "Tự học lập trình React Native - Bài 5: Styling React Native",
          duration: 8,
          youtubeVideoId: "Hth-MKVtrto",
        },
      ],
      rating: 4.7,
      reviewCount: 3,
      studentsEnrolled: 120,
      isFeatured: true,
      isPublished: true,
      tags: ["react-native", "expo", "mobile", "frontend"],
    },
    {
      title: "NodeJS & ExpressJS",
      description:
        "Triển khai REST API chuẩn: Auth (JWT), phân quyền, validation, upload file, best practices.",
      thumbnail:
        "https://th.bing.com/th/id/OIP.Jr3NFSKTfQWRUyjblBSKegAAAA?w=229&h=142&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      price: 65,
      instructor: U["khoi.teacher@example.com"]._id,
      category: cat["Lập trình Web"]._id,
      lessons: [
        {
          title:
            "Lời khuyên trước khóa học Node Express | Học lập trình cơ bản | Học NodeJS miễn phí",
          duration: 8,
          youtubeVideoId: "z2f7RHgvddc",
        },
        {
          title:
            "HTTP protocol | Giao thức HTTP | Giao thức truyền tải siêu văn bản",
          duration: 15,
          youtubeVideoId: "SdcdneSdoV4",
        },
        {
          title: "SSR & CSR | Sever side rendering | Client side rendering",
          duration: 12,
          youtubeVideoId: "HLEu57iLrRo",
        },
        {
          title: "Cài đặt NodeJS | Install NodeJS",
          duration: 1,
          youtubeVideoId: "CcSuYLjKW3g",
        },
        {
          title: "Cài đặt Express framework | Install Express",
          duration: 18,
          youtubeVideoId: "tfQXZ8jES6A",
        },
        {
          title: "Sử dụng thư viện Nodemon | Install Nodemon & inspector",
          duration: 10,
          youtubeVideoId: "zCFOn4YXr00",
        },
        {
          title: "Add sourcode lên Github | Add git repository",
          duration: 2,
          youtubeVideoId: "f0C9kTOf6IY",
        },
        {
          title: "Cài đặt thư viện Morgan | Install Morgan | Morgan - npm",
          duration: 5,
          youtubeVideoId: "seI--u0hSeg",
        },
      ],
      rating: 4.6,
      reviewCount: 2,
      studentsEnrolled: 95,
      isFeatured: true,
      isPublished: true,
      tags: ["node", "express", "rest", "api", "jwt"],
    },
    {
      title: "Data Analysis với Python cơ bản",
      description:
        "Numpy, Pandas, Visualization, EDA, làm việc với dataset thực tế. Phù hợp cho người mới bắt đầu.",
      thumbnail:
        "https://th.bing.com/th/id/OIP.4EU53ee9-fHJDmZHUi3ZLwHaD5?w=334&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      price: 48,
      instructor: U["duy.teacher@example.com"]._id,
      category: cat["Khoa học dữ liệu"]._id,
      lessons: [
        {
          title:
            "Data Analysis cho người mới bắt đầu với Python | Bài 01 - Giới thiệu về Python và các công cụ hỗ trợ",
          duration: 143,
          youtubeVideoId: "yMxi5ObGWA4",
        },
        {
          title:
            "Data Analysis cho người mới bắt đầu với Python | Bài 02 - Các kiểu dữ liệu trong Python",
          duration: 114,
          youtubeVideoId: "k2u2lf5ijGk",
        },
        {
          title:
            "Data Analysis cho người mới bắt đầu với Python | Bài 03 - IF ELSE, For loop, hàm...",
          duration: 172,
          youtubeVideoId: "1IPPBzsxpmw",
        },
        {
          title:
            "Data Analysis cho người mới bắt đầu với Python | Bài 04 - Numpy & Pandas trong python.",
          duration: 135,
          youtubeVideoId: "331VEjrGKFs",
        },
      ],
      rating: 4.5,
      reviewCount: 2,
      studentsEnrolled: 80,
      isFeatured: false,
      isPublished: true,
      tags: ["python", "pandas", "numpy", "eda"],
    },
    {
      title: "Học FIGMA 2025 thiết kế UX/UI",
      description:
        "Nguyên tắc thiết kế, wireframe, prototype nhanh, usability. Dẫn dắt bạn từ ý tưởng đến prototype.",
      thumbnail:
        "https://th.bing.com/th/id/OIP.4YJuVcwIHZWmh6xTtDqnxgHaDt?w=321&h=175&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      price: 55,
      instructor: U["ha.teacher@example.com"]._id,
      category: cat["Thiết kế UI/UX"]._id,
      lessons: [
        {
          title:
            "Bài 1 tự học Figma | Học figma cực dễ sau 30 phút | Xu hướng UI/UX 2025",
          duration: 21,
          youtubeVideoId: "YNeOB8AqCgs",
        },
        {
          title:
            "Bài 2 tự học Figma | Làm việc với Move, Scale, Frame và Slice Tool | UI/UX 2025",
          duration: 30,
          youtubeVideoId: "--6ABDok-AI",
        },
        {
          title:
            "Bài 3 tự học Figma | Draw Vector Shapes và Pen Tool | UIUX 2025",
          duration: 36,
          youtubeVideoId: "NHP5uzfw-6c",
        },
      ],
      rating: 4.4,
      reviewCount: 1,
      studentsEnrolled: 60,
      isFeatured: true,
      isPublished: true,
      tags: ["uiux", "prototype", "wireframe"],
    },
    {
      title: "DevOps on AWS for Beginner",
      description:
        "Docker, Docker Compose, pipeline CI/CD cơ bản, best practices để deploy nhanh & ổn định.",
      thumbnail:
        "https://th.bing.com/th/id/OIP.08XNYDxlt1wzPmN1QQwWxQHaD4?w=303&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      price: 60,
      instructor: U["anh.teacher@example.com"]._id,
      category: cat["DevOps"]._id,
      lessons: [
        {
          title:
            "Bài 1. Giới thiệu về DevOps On AWS | Khóa học DevOps on AWS cho người mới bắt đầu",
          duration: 8,
          youtubeVideoId: "bm6ZGCnQqsw",
        },
        {
          title:
            "Bài 2. DevOps Roadmap sơ lược | Khóa học DevOps on AWS cho người mới bắt đầu",
          duration: 13,
          youtubeVideoId: "2zphcBxe_go",
        },
        {
          title:
            "Bài 3. Các nguồn tài liệu DevOps | Khóa học DevOps on AWS cho người mới bắt đầu",
          duration: 13,
          youtubeVideoId: "jwLR2UMIRU0",
        },
        {
          title:
            "Bài 4. Vấn đề bảo mật và cẩn trọng trong DevOps | Khóa học DevOps on AWS cho người mới bắt đầu",
          duration: 7,
          youtubeVideoId: "5EaxR6LYiG4",
        },
      ],
      rating: 4.3,
      reviewCount: 1,
      studentsEnrolled: 55,
      isFeatured: false,
      isPublished: true,
      tags: ["docker", "cicd", "devops"],
    },
    {
      title: "Khóa học sử dụng SQL server",
      description:
        "ERD, JOIN, Index, tối ưu truy vấn và thực hành trên MySQL/PostgreSQL. Dành cho backend dev.",
      thumbnail:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1280&auto=format&fit=crop",
      price: 55,
      instructor: U["khoi.teacher@example.com"]._id,
      category: cat["Hệ quản trị CSDL"]._id,
      lessons: [
        {
          title:
            "[Khóa học sử dụng SQL server] - Bài 1: Giới thiệu SQL và SQL server | HowKteam",
          duration: 14,
          youtubeVideoId: "2fanjSYVElY",
        },
        {
          title:
            "[Khóa học sử dụng SQL server] - Bài 2: Tạo database | HowKteam",
          duration: 11,
          youtubeVideoId: "XUIm5VQlpJM",
        },
        {
          title: "[Khóa học sử dụng SQL server] - Bài 3: Tạo bảng | HowKteam",
          duration: 21,
          youtubeVideoId: "TrLKdQH_Qng",
        },
      ],
      rating: 4.2,
      reviewCount: 0,
      studentsEnrolled: 30,
      isFeatured: false,
      isPublished: true,
      tags: ["sql", "database", "index"],
    },
  ];

  const courses = await Course.insertMany(coursesPayload);
  const C = Object.fromEntries(courses.map((c) => [c.title, c]));
  console.log(`🎓 Inserted ${courses.length} courses`);

  // 4) FOLLOW / SAVED / CART (tạo 1 ít dữ liệu tương tác user)
  await User.findByIdAndUpdate(U["hau.student@example.com"]._id, {
    $addToSet: {
      savedCourses: [
        C["Tự học lập trình React Native từ A đến Z"]._id,
        C["NodeJS & ExpressJS"]._id,
      ],
      cart: [C["Khóa học sử dụng SQL server"]._id],
      following: [
        U["ha.teacher@example.com"]._id,
        U["khoi.teacher@example.com"]._id,
      ],
    },
  });
  await User.findByIdAndUpdate(U["ha.teacher@example.com"]._id, {
    $addToSet: { followers: [U["hau.student@example.com"]._id] },
  });

  // 5) ENROLLMENTS
  const enrollments = await Enrollment.insertMany([
    {
      user: U["hau.student@example.com"]._id,
      course: C["Tự học lập trình React Native từ A đến Z"]._id,
      progress: 35,
    },
    {
      user: U["hau.student@example.com"]._id,
      course: C["NodeJS & ExpressJS"]._id,
      progress: 10,
    },
    {
      user: U["linh.student@example.com"]._id,
      course: C["Data Analysis với Python cơ bản"]._id,
      progress: 55,
    },
    {
      user: U["nam.student@example.com"]._id,
      course: C["Học FIGMA 2025 thiết kế UX/UI"]._id,
      progress: 5,
    },
  ]);
  console.log(`📝 Inserted ${enrollments.length} enrollments`);

  // 6) REVIEWS (khớp reviewCount & rating đã set ở Course)
  const reviews = await Review.insertMany([
    {
      user: U["hau.student@example.com"]._id,
      course: C["Tự học lập trình React Native từ A đến Z"]._id,
      rating: 5,
      comment: "Khoá rất thực tế, code + bài tập rõ ràng!",
    },
    {
      user: U["linh.student@example.com"]._id,
      course: C["Tự học lập trình React Native từ A đến Z"]._id,
      rating: 4,
      comment: "Giải thích dễ hiểu, mong thêm phần Redux.",
    },
    {
      user: U["nam.student@example.com"]._id,
      course: C["Tự học lập trình React Native từ A đến Z"]._id,
      rating: 5,
      comment: "Giảng viên support nhanh.",
    },
    {
      user: U["linh.student@example.com"]._id,
      course: C["NodeJS & ExpressJS"]._id,
      rating: 5,
      comment: "JWT & best practices rất hữu ích.",
    },
    {
      user: U["nam.student@example.com"]._id,
      course: C["NodeJS & ExpressJS"]._id,
      rating: 4,
      comment: "Thiếu phần rate limiter, còn lại OK.",
    },
    {
      user: U["linh.student@example.com"]._id,
      course: C["Data Analysis với Python cơ bản"]._id,
      rating: 4,
      comment: "Pandas phần ví dụ rất tốt.",
    },
    {
      user: U["hau.student@example.com"]._id,
      course: C["Data Analysis với Python cơ bản"]._id,
      rating: 5,
      comment: "Đủ để bắt đầu EDA.",
    },
    {
      user: U["nam.student@example.com"]._id,
      course: C["Học FIGMA 2025 thiết kế UX/UI"]._id,
      rating: 4,
      comment: "Dễ theo dõi, nhiều ví dụ thực tế.",
    },
    {
      user: U["hau.student@example.com"]._id,
      course: C["DevOps on AWS for Beginner"]._id,
      rating: 4,
      comment: "Kiến thức vừa đủ, pipeline demo ok.",
    },
  ]);
  console.log(`⭐ Inserted ${reviews.length} reviews`);

  // (Tuỳ chọn) Đồng bộ lại rating/reviewCount theo Reviews thực tế
  const byCourse = reviews.reduce((m, r) => {
    const key = r.course.toString();
    m[key] = m[key] || { sum: 0, count: 0 };
    m[key].sum += r.rating;
    m[key].count += 1;
    return m;
  }, {});
  await Promise.all(
    Object.entries(byCourse).map(([courseId, { sum, count }]) =>
      Course.findByIdAndUpdate(courseId, {
        $set: {
          rating: Math.round((sum / count) * 10) / 10,
          reviewCount: count,
        },
      })
    )
  );

  // 7) QUESTIONS
  const questions = await Question.insertMany([
    {
      user: U["hau.student@example.com"]._id,
      course: C["Tự học lập trình React Native từ A đến Z"]._id,
      text: "Phần Navigation stack có ví dụ deep link không ạ?",
    },
    {
      user: U["linh.student@example.com"]._id,
      course: C["Data Analysis với Python cơ bản"]._id,
      text: "EDA có guideline chọn chart theo loại dữ liệu không?",
    },
  ]);
  console.log(`❓ Inserted ${questions.length} questions`);

  // 8) PROJECTS (bài tập nộp)
  const projects = await Project.insertMany([
    {
      user: U["hau.student@example.com"]._id,
      course: C["Tự học lập trình React Native từ A đến Z"]._id,
      description: "App ghi chú cá nhân với CRUD + AsyncStorage",
      files: [
        { name: "README.md", url: "https://example.com/notes-app/readme" },
        { name: "screens.mp4", url: "https://example.com/notes-app/demo.mp4" },
      ],
    },
    {
      user: U["linh.student@example.com"]._id,
      course: C["Data Analysis với Python cơ bản"]._id,
      description: "EDA dataset bán hàng: doanh thu theo tháng/quý",
      files: [
        { name: "notebook.ipynb", url: "https://example.com/eda/notebook" },
      ],
    },
  ]);
  console.log(`📦 Inserted ${projects.length} projects`);

  // 9) Cập nhật một số counter phụ cho đẹp
  await Course.findByIdAndUpdate(
    C["Tự học lập trình React Native từ A đến Z"]._id,
    {
      $set: {
        studentsEnrolled:
          120 +
          enrollments.filter((e) =>
            e.course.equals(C["Tự học lập trình React Native từ A đến Z"]._id)
          ).length,
      },
    }
  );

  console.log("✅ Seed completed.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
