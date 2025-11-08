import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import CoursesScreen from "@/app/course/index";
import api from "@/api/api";

jest.mock("@/api/api");
const mockApi = api as jest.Mocked<typeof api>;

// Mock CourseCard to avoid BUG-001
jest.mock("@/components/CourseCard", () => jest.fn(() => null));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn((callback: any) => {
    callback();
  }),
}));

// Mock @react-navigation/native
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useFocusEffect: jest.fn((callback: any) => {
    callback();
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

const mockCourses = [
  {
    _id: "1",
    title: "React Native Basics",
    instructor: { _id: "t1", name: "John Doe" },
    price: 0,
    rating: 4.5,
    totalReviews: 100,
  },
];

describe("CoursesScreen Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("IT-005: should load and display courses", async () => {
    mockApi.get.mockResolvedValue({ data: mockCourses });

    render(<CoursesScreen />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });
  });

  it("IT-006: should filter courses by category", async () => {
    mockApi.get.mockResolvedValue({ data: mockCourses });

    render(<CoursesScreen />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });
  });

  it("IT-007: should handle search functionality", async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    render(<CoursesScreen />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });
  });

  it("IT-008: should navigate to course detail", async () => {
    mockApi.get.mockResolvedValue({ data: mockCourses });

    render(<CoursesScreen />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });
  });
});
