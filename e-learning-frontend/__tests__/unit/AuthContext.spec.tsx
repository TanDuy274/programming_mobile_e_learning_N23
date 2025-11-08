import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import api from "@/api/api";

// Mock api
jest.mock("@/api/api");
const mockApi = api as jest.Mocked<typeof api>;

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage");

// Mock Toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    // Clear ALL mocks completely
    jest.resetAllMocks();
  });

  it("UT-001: should provide initial auth state with no user", async () => {
    // Mock empty initial state
    mockApi.get.mockResolvedValue({ data: [] });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initialization to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userInfo).toBeNull();
    expect(result.current.userToken).toBeNull();
  });

  it("UT-002: should login successfully and update state", async () => {
    const mockUserData = {
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      role: "student" as const,
      following: [],
      savedCourses: [],
    };

    const mockLoginResponse = {
      data: {
        token: "mock-token-123",
        ...mockUserData,
      },
    };

    // Mock login API call
    mockApi.post.mockResolvedValueOnce(mockLoginResponse);
    
    // Mock fetchEnrollments, fetchCart, fetchUserInfo calls
    mockApi.get.mockImplementation((url) => {
      if (url === "/auth/me") {
        return Promise.resolve({ data: mockUserData });
      }
      return Promise.resolve({ data: [] });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.userInfo).toEqual(mockUserData);
      expect(result.current.userToken).toBe("mock-token-123");
    });

    expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "password123",
    });
  });

  it("UT-003: should handle login error gracefully", async () => {
    // Mock empty initial state
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockRejectedValueOnce(new Error("Invalid credentials"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // userInfo should be null after initialization
    expect(result.current.userInfo).toBeNull();

    // Try to login with wrong credentials
    await act(async () => {
      try {
        await result.current.login("wrong@example.com", "wrongpass");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    // userInfo should still be null after failed login
    expect(result.current.userInfo).toBeNull();
  });

  it("UT-004: should logout and clear user data", async () => {
    const mockUserData = {
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      role: "student" as const,
      following: [],
      savedCourses: [],
    };

    const mockLoginResponse = {
      data: {
        token: "mock-token-123",
        ...mockUserData,
      },
    };

    // Mock for initial load + login
    mockApi.get.mockImplementation((url) => {
      if (url === "/auth/me") {
        return Promise.resolve({ data: mockUserData });
      }
      return Promise.resolve({ data: [] });
    });
    mockApi.post.mockResolvedValueOnce(mockLoginResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Login first
    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.userInfo).toEqual(mockUserData);
    });

    // Then logout
    await act(async () => {
      result.current.logout();
    });

    expect(result.current.userInfo).toBeNull();
    expect(result.current.userToken).toBeNull();
  });

  it("UT-005: should register new user successfully", async () => {
    const mockUserData = {
      _id: "newuser123",
      name: "New User",
      email: "newuser@example.com",
      role: "student" as const,
      following: [],
      savedCourses: [],
    };

    const mockRegisterResponse = {
      data: {
        token: "new-token-123",
        ...mockUserData,
      },
    };

    // Mock for initial load + register
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockResolvedValueOnce(mockRegisterResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.register(
        "New User",
        "newuser@example.com",
        "password123"
      );
    });

    await waitFor(() => {
      expect(result.current.userInfo).toEqual(mockUserData);
      expect(result.current.userToken).toBe("new-token-123");
    });

    expect(mockApi.post).toHaveBeenCalledWith("/auth/register", {
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
    });
  });
});
