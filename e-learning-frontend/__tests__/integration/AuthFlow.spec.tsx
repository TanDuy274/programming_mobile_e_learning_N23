import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import api from "@/api/api";

// Mock SecureStore
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock Toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock API
jest.mock("@/api/api");
const mockApi = api as jest.Mocked<typeof api>;

// Test component to access context - using React Native components
const TestComponent = () => {
  const { userInfo, login, logout, isLoading } = React.useContext(AuthContext);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await login("test@example.com", "password123");
      setLoginError(null);
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  if (isLoading) {
    return <View testID="loading" />;
  }

  return (
    <View>
      <TouchableOpacity testID="login-button" onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="logout-button" onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      {userInfo && <Text>User: {userInfo.name}</Text>}
      {loginError && <Text testID="login-error">{loginError}</Text>}
    </View>
  );
};

describe("Auth Flow Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.defaults = { headers: { common: {} } } as any;
  });

  it("IT-001: should initialize with no user", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/User:/)).toBeNull();
    });
  });

  it("IT-002: should login successfully", async () => {
    const mockLoginResponse = {
      data: {
        token: "mock-token",
        _id: "user1",
        name: "Test User",
        email: "test@example.com",
        role: "student",
        savedCourses: [],
        following: [],
      },
    };

    mockApi.post.mockResolvedValueOnce(mockLoginResponse);
    mockApi.get.mockResolvedValue({ data: [] }); // For enrollments, cart, etc.

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId("login-button")).toBeTruthy();
    });

    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("IT-003: should handle login error", async () => {
    mockApi.post.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { getByTestId, queryByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId("login-button")).toBeTruthy();
    });

    // Login will trigger error
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled();
    });

    // Error message should be displayed
    await waitFor(() => {
      expect(queryByTestId("login-error")).toBeTruthy();
    });
  });

  it("IT-004: should logout successfully", async () => {
    const mockLoginResponse = {
      data: {
        token: "mock-token",
        _id: "user1",
        name: "Test User",
        email: "test@example.com",
        role: "student",
        savedCourses: [],
        following: [],
      },
    };

    mockApi.post.mockResolvedValueOnce(mockLoginResponse);
    mockApi.get.mockResolvedValue({ data: [] });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId("login-button")).toBeTruthy();
    });

    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled();
    });

    // Now logout
    const logoutButton = getByTestId("logout-button");
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(screen.queryByText(/User:/)).toBeNull();
    });
  });
});
