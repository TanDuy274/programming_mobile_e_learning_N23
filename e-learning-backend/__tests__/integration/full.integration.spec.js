// __tests__/integration/full.integration.spec.js
const { bypassAuth } = require("../helpers/mockAuth");

// 1. GỌI BYPASS AUTH LÊN DÒNG ĐẦU TIÊN
bypassAuth("admin"); // bypass auth, mặc định role admin

/*** MOCK MODELS ***/
// 2. MOCK HOÀN CHỈNH (BAO GỒM .lean(), .aggregate(), .countDocuments() VÀ SỬA LỖI 404)

jest.mock("../../models/CategoryModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "c1", name: "Science" }];

  // HÀM MOCK HOÀN CHỈNH CHO QUERY CHAIN
  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(), // <--- SỬA LỖI 500 (GET)
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ), // <--- SỬA LỖI 500 (GET)
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result), // <--- SỬA LỖI 404 (PUT)
  });

  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn(
      (
        id // <--- SỬA LỖI 404
      ) => createChain(arr.find((x) => x._id === id) || null)
    ),
    findOne: jest.fn(
      (
        query // <--- SỬA LỖI 404/500
      ) => createChain(arr.find((item) => item.name === query.name) || null)
    ),
    create: jest.fn((data) => {
      // create() trả về Promise trực tiếp
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn(
      (
        id // <--- SỬA LỖI 404
      ) => createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      // <--- SỬA LỖI 404
      const item = arr.find((x) => x._id === id);
      if (item) Object.assign(item, data);
      return createChain(item); // Trả về chain
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length), // <--- SỬA LỖI 500 (Static)
    aggregate: jest.fn(() => createChain(arr)), // <--- SỬA LỖI 500 (Static)
    distinct: jest.fn(() => createChain(arr.map((i) => i.name))), // <--- SỬA LỖI 500 (Static)
  };
});

jest.mock("../../models/UserModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "u1", name: "Teacher 1", role: "teacher" }];

  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ),
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result),
  });

  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn(
      (id) =>
        createChain(arr.find((x) => x._id === id || x._id === "u1") || null) // Tìm 'u1'
    ),
    findOne: jest.fn((query) =>
      createChain(arr.find((item) => item.email === query.email) || null)
    ),
    create: jest.fn((data) => {
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      const item = arr.find((x) => x._id === id || x._id === "u1");
      if (item) Object.assign(item, data);
      return createChain(item); // Trả về chain
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length),
    aggregate: jest.fn(() => createChain(arr)),
    distinct: jest.fn(() => createChain(arr.map((i) => i.name))),
  };
});

jest.mock("../../models/CourseModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "course1", title: "Physics" }];

  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ),
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result),
  });

  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findOne: jest.fn((query) =>
      createChain(arr.find((item) => item.title === query.title) || null)
    ),
    create: jest.fn((data) => {
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      const item = arr.find((x) => x._id === id);
      if (item) Object.assign(item, data);
      return createChain(item); // Trả về chain
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length),
    aggregate: jest.fn(() => createChain(arr)),
    distinct: jest.fn(() => createChain(arr.map((i) => i.title))),
  };
});

jest.mock("../../models/EnrollmentModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "e1", user: "u1", course: "course1" }];

  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ),
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result),
  });

  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findOne: jest.fn((query) =>
      createChain(
        arr.find(
          (item) =>
            (query.user ? item.user === query.user : true) &&
            (query.course ? item.course === query.course : true)
        ) || null
      )
    ),
    create: jest.fn((data) => {
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      const item = arr.find((x) => x._id === id);
      if (item) Object.assign(item, data);
      return createChain(item); // Trả về chain
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length),
    aggregate: jest.fn(() => createChain(arr)),
    distinct: jest.fn(() => createChain(arr.map((i) => i.user))),
  };
});

// Lặp lại logic tương tự cho các model còn lại...

jest.mock("../../models/ReviewModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "r1" }];
  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ),
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result),
  });
  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findOne: jest.fn(() => createChain(arr[0] || null)),
    create: jest.fn((data) => {
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      const item = arr.find((x) => x._id === id);
      if (item) Object.assign(item, data);
      return createChain(item);
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length),
    aggregate: jest.fn(() => createChain(arr)),
    distinct: jest.fn(() => createChain([])),
  };
});

jest.mock("../../models/ProjectModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "p1" }];
  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ),
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result),
  });
  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findOne: jest.fn(() => createChain(arr[0] || null)),
    create: jest.fn((data) => {
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      const item = arr.find((x) => x._id === id);
      if (item) Object.assign(item, data);
      return createChain(item);
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length),
    aggregate: jest.fn(() => createChain(arr)),
    distinct: jest.fn(() => createChain([])),
  };
});

jest.mock("../../models/QuestionModel", () => {
  const { v4: uuidv4 } = require("uuid");
  const arr = [{ _id: "q1" }];
  const createChain = (result) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    countDocuments: jest
      .fn()
      .mockResolvedValue(
        Array.isArray(result) ? result.length : result ? 1 : 0
      ),
    exec: jest.fn().mockResolvedValue(result),
    then: function (onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    save: jest.fn().mockResolvedValue(result),
  });
  return {
    find: jest.fn(() => createChain(arr)),
    findById: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findOne: jest.fn(() => createChain(arr[0] || null)),
    create: jest.fn((data) => {
      const newItem = { _id: uuidv4(), ...data };
      arr.push(newItem);
      return Promise.resolve(newItem);
    }),
    findByIdAndDelete: jest.fn((id) =>
      createChain(arr.find((x) => x._id === id) || null)
    ),
    findByIdAndUpdate: jest.fn((id, data) => {
      const item = arr.find((x) => x._id === id);
      if (item) Object.assign(item, data);
      return createChain(item);
    }),
    countDocuments: jest.fn().mockResolvedValue(arr.length),
    aggregate: jest.fn(() => createChain(arr)),
    distinct: jest.fn(() => createChain([])),
  };
});

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(() => Promise.resolve("salt")),
  hash: jest.fn((pw) => Promise.resolve(`hashed-${pw}`)),
}));

// 4. IMPORT APP VÀ REQUEST SAU CÙNG
const request = require("supertest");
const app = require("../../app");

/*** TESTS ***/
describe("FULL Integration Tests", () => {
  /*** ADMIN ROUTES ***/
  describe("Admin routes", () => {
    it("GET /admin/categories", async () => {
      const res = await request(app).get("/admin/categories");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Science");
    });

    it("POST /admin/categories", async () => {
      const res = await request(app)
        .post("/admin/categories")
        .send({ name: "Math" })
        .redirects(1);
      expect(res.statusCode).toBe(200);
    });

    it("DELETE /admin/categories/:id/delete", async () => {
      const res = await request(app).get("/admin/categories/c1/delete");
      expect(res.statusCode).toBe(302);
    });

    it("GET /admin/courses", async () => {
      const res = await request(app).get("/admin/courses");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Physics");
    });

    it("POST /admin/courses/new", async () => {
      const res = await request(app)
        .post("/admin/courses/new")
        .send({
          title: "Chemistry",
          instructor: "u1",
          category: "c1",
          price: 100,
        })
        .redirects(1);
      expect(res.statusCode).toBe(200);
    });

    it("DELETE /admin/courses/:id/delete", async () => {
      const res = await request(app).get("/admin/courses/course1/delete");
      expect(res.statusCode).toBe(302);
    });

    it("GET /admin/users", async () => {
      const res = await request(app).get("/admin/users");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Teacher 1");
    });

    it("POST /admin/users/new", async () => {
      const res = await request(app)
        .post("/admin/users/new")
        .send({
          name: "Student 1",
          email: "student1@test.com",
          password: "123456",
          role: "student",
        })
        .redirects(1);
      expect(res.statusCode).toBe(200);
    });

    it("DELETE /admin/users/:id/delete", async () => {
      const res = await request(app).get("/admin/users/u1/delete");
      expect(res.statusCode).toBe(302);
    });
  });

  /*** CATEGORY API ***/
  describe("Category API", () => {
    it("GET /api/categories", async () => {
      const res = await request(app).get("/api/categories");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /api/categories", async () => {
      const res = await request(app)
        .post("/api/categories")
        .send({ name: "Math" });
      expect(res.statusCode).toBe(201);
    });
  });

  /*** COURSE API ***/
  describe("Course API", () => {
    it("GET /api/courses", async () => {
      const res = await request(app).get("/api/courses");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /api/courses", async () => {
      const res = await request(app).post("/api/courses").send({
        title: "Algebra",
        instructor: "u1",
        category: "c1",
        price: 50,
      });
      // Logic: 'admin' (từ bypassAuth) bị cấm tạo khóa học
      expect(res.statusCode).toBe(403);
    });
  });

  /*** USER API ***/
  describe("User API", () => {
    it("PUT /api/users/profile", async () => {
      const res = await request(app)
        .put("/api/users/profile")
        .send({ name: "Updated" });
      // Lỗi 404 đã được sửa (thêm .save() và sửa findById)
      expect(res.statusCode).toBe(200);
    });
  });

  /*** ENROLLMENT API ***/
  describe("Enrollment API", () => {
    it("GET /api/enrollments/my-courses", async () => {
      const res = await request(app).get("/api/enrollments/my-courses");
      expect(res.statusCode).toBe(200);
    });

    it("POST /api/enrollments/:courseId", async () => {
      const res = await request(app).post("/api/enrollments/course1");
      // Lỗi 404 đã được sửa (findById trả về chain)
      expect(res.statusCode).toBe(201);
    });

    it("PUT /api/enrollments/:enrollmentId/progress", async () => {
      const res = await request(app)
        .put("/api/enrollments/e1/progress")
        .send({ progress: 50 });
      // Lỗi 404 đã được sửa (findByIdAndUpdate trả về chain)
      expect(res.statusCode).toBe(200);
    });
  });

  /*** REVIEW API ***/
  describe("Review API", () => {
    it("GET /api/courses/course1/reviews", async () => {
      const res = await request(app).get("/api/courses/course1/reviews");
      expect(res.statusCode).toBe(200);
    });

    it("POST /api/courses/course1/reviews", async () => {
      const res = await request(app)
        .post("/api/courses/course1/reviews")
        .send({ rating: 5, comment: "Good" });
      // Lỗi 403 (Forbidden) là logic đúng
      // (vì 'admin' chưa enroll khóa học, mock 'findOne' của enrollment trả về null)
      expect(res.statusCode).toBe(403);
    });
  });

  /*** PROJECT API ***/
  describe("Project API", () => {
    it("GET /api/projects/course1", async () => {
      const res = await request(app).get("/api/projects/course1");
      expect(res.statusCode).toBe(200);
    });

    it("POST /api/projects", async () => {
      const res = await request(app)
        .post("/api/projects")
        .send({ course: "course1", user: "u1" });
      expect(res.statusCode).toBe(201);
    });
  });

  /*** QUESTION API ***/
  describe("Question API", () => {
    it("GET /api/questions/course1", async () => {
      const res = await request(app).get("/api/questions/course1");
      expect(res.statusCode).toBe(200);
    });

    it("POST /api/questions", async () => {
      const res = await request(app).post("/api/questions").send({
        course: "course1",
        user: "u1",
        title: "My Question",
        text: "What is this?",
      });
      expect(res.statusCode).toBe(201);
    });
  });
});
