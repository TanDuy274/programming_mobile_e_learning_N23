import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000/api";

// Mock data
const mockCategories = [
  { _id: "cat1", name: "Code" },
  { _id: "cat2", name: "Design" },
  { _id: "cat3", name: "Business" },
];

const mockCourses = [
  {
    _id: "course1",
    title: "React Native Fundamentals",
    instructor: { _id: "teacher1", name: "John Doe" },
    price: 49.99,
    rating: 4.5,
    reviewCount: 123,
    thumbnail: "https://example.com/thumb1.jpg",
    lessons: [{ _id: "l1", title: "Intro" }],
    category: { _id: "cat1", name: "Code" },
    totalDurationMinutes: 120,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: "course2",
    title: "Advanced TypeScript",
    instructor: { _id: "teacher2", name: "Jane Smith" },
    price: 0,
    rating: 4.8,
    reviewCount: 456,
    thumbnail: "https://example.com/thumb2.jpg",
    lessons: [{ _id: "l2", title: "Types" }],
    category: { _id: "cat1", name: "Code" },
    totalDurationMinutes: 90,
    isFeatured: false,
    isPublished: true,
  },
];

const mockTeachers = [
  {
    _id: "teacher1",
    name: "John Doe",
    email: "john@example.com",
    role: "teacher",
    avatar: "https://example.com/avatar1.jpg",
  },
  {
    _id: "teacher2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "teacher",
    avatar: "https://example.com/avatar2.jpg",
  },
];

const mockUser = {
  _id: "user1",
  name: "Test User",
  email: "test@example.com",
  role: "student",
  savedCourses: ["course1"],
  following: [],
};

export const handlers = [
  // Categories
  http.get(`${BASE_URL}/categories`, () => {
    return HttpResponse.json({ docs: mockCategories });
  }),

  // Courses - list
  http.get(`${BASE_URL}/courses`, ({ request }) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort");
    const featured = url.searchParams.get("featured");

    let courses = [...mockCourses];

    if (featured === "1") {
      courses = courses.filter((c) => c.isFeatured);
    }

    if (sort === "popular") {
      courses.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return HttpResponse.json({ docs: courses, total: courses.length });
  }),

  // Courses - search
  http.get(`${BASE_URL}/courses/search`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword");

    if (!keyword) {
      return HttpResponse.json([]);
    }

    const results = mockCourses.filter((c) =>
      c.title.toLowerCase().includes(keyword.toLowerCase())
    );

    return HttpResponse.json(results);
  }),

  // Course by ID
  http.get(`${BASE_URL}/courses/:id`, ({ params }) => {
    const course = mockCourses.find((c) => c._id === params.id);
    if (!course) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(course);
  }),

  // Teachers
  http.get(`${BASE_URL}/users/teachers`, () => {
    return HttpResponse.json({ docs: mockTeachers });
  }),

  // Auth - Login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json({
        token: "mock-token-123",
        ...mockUser,
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // Auth - Register
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      token: "mock-token-456",
      _id: "newuser1",
      name: body.name,
      email: body.email,
      role: "student",
      savedCourses: [],
      following: [],
    });
  }),

  // Auth - Me
  http.get(`${BASE_URL}/auth/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  // Cart
  http.get(`${BASE_URL}/users/cart`, () => {
    return HttpResponse.json([mockCourses[0]]);
  }),

  http.post(`${BASE_URL}/users/cart`, () => {
    return HttpResponse.json({ message: "Added to cart" });
  }),

  http.delete(`${BASE_URL}/users/cart/:courseId`, () => {
    return HttpResponse.json({ message: "Removed from cart" });
  }),

  // Enrollments
  http.get(`${BASE_URL}/enrollments/my-courses`, () => {
    return HttpResponse.json([
      {
        _id: "enroll1",
        course: mockCourses[0],
        progress: 45,
      },
    ]);
  }),

  // Save course
  http.put(`${BASE_URL}/users/save-course`, () => {
    return HttpResponse.json({ message: "Course saved" });
  }),
];
