// __tests__/integration/setupIntegrationTest.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app } = require("../../app"); // file express app
const request = require("supertest");
const { QueryChain } = require("../../__mocks__/QueryChain");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Category = require("../../models/Category");

let adminToken;
let testUser;
let testCategory;
let testCourse;

beforeAll(async () => {
  // 1️⃣ Connect test DB (in-memory)
  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // 2️⃣ Create test data
  testUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });

  testCategory = await Category.create({ name: "Science" });

  testCourse = await Course.create({
    title: "Physics",
    description: "Physics course",
    instructor: testUser._id,
    category: testCategory._id,
    price: 100,
    lessons: [],
  });

  // 3️⃣ Generate admin JWT token
  adminToken = jwt.sign(
    { id: testUser._id.toString(), role: "admin" },
    process.env.JWT_SECRET || "testsecret",
    { expiresIn: "1h" }
  );

  // 4️⃣ Optional: mock QueryChain if some models are stubbed
  jest.mock("../../models/Course", () => {
    const realModule = jest.requireActual("../../models/Course");
    return {
      ...realModule,
      find: jest
        .fn()
        .mockImplementation(() => QueryChain.fromArray([testCourse])),
      findById: jest
        .fn()
        .mockImplementation(() => QueryChain.fromArray([testCourse])),
    };
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

module.exports = {
  app,
  request,
  adminToken,
  testUser,
  testCourse,
  testCategory,
};
