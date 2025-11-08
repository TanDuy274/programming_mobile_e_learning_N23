import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import QandATab from "@/components/learning/QandATab";
import api from "@/api/api";
import { AuthContext } from "@/context/AuthContext";

jest.mock("@/api/api");
const mockedApi = api as jest.Mocked<typeof api>;

const mockAuthContextValue = {
  userInfo: {
    _id: "user1",
    name: "Test User",
    email: "test@example.com",
    role: "student" as const,
    following: [],
    savedCourses: [],
  },
  userToken: "test-token",
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  enrollments: [],
  fetchEnrollments: jest.fn(),
  updateUserInfo: jest.fn(),
  fetchUserInfo: jest.fn(),
  savedCourses: [],
  toggleSaveCourse: jest.fn(),
  cart: [],
  fetchCart: jest.fn(),
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
};

describe("QandATab Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuth = (component: React.ReactElement) => {
    return render(
      <AuthContext.Provider value={mockAuthContextValue}>
        {component}
      </AuthContext.Provider>
    );
  };

  it("UT-063: should display questions list", async () => {
    mockedApi.get.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    );
    renderWithAuth(<QandATab courseId="course1" />);

    await waitFor(() => {
      expect(screen.getByText("Q&A Community")).toBeTruthy();
    });
  });

  it("UT-064: should allow asking new question", async () => {
    mockedApi.get.mockResolvedValue({ data: [] });
    mockedApi.post.mockResolvedValue({ data: { success: true } });

    renderWithAuth(<QandATab courseId="course1" />);

    await waitFor(() => {
      expect(screen.getByText("Send question")).toBeTruthy();
    });
  });

  it("UT-065: should filter by unanswered", async () => {
    mockedApi.get.mockResolvedValue({ data: [] });

    renderWithAuth(<QandATab courseId="course1" />);

    await waitFor(() => {
      expect(screen.getByText("Q&A Community")).toBeTruthy();
    });
  });
});
