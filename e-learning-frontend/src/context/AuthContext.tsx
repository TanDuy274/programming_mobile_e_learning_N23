import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api/api"; // << ĐÃ SỬA LỖI

// Định nghĩa kiểu cho thông tin người dùng
interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
}

// Cập nhật kiểu dữ liệu cho context
interface AuthContextType {
  userToken: string | null;
  userInfo: UserInfo | null; // << THÊM MỚI
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // << THÊM MỚI
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // << THÊM MỚI

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;

      setUserToken(token);
      setUserInfo(userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Cập nhật header
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userInfo", JSON.stringify(userData)); // Lưu user info
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // << THÊM MỚI
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, ...userData } = response.data;

      setUserToken(token);
      setUserInfo(userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userInfo", JSON.stringify(userData));
    } catch (error: any) {
      // Cung cấp lỗi cụ thể hơn từ backend
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";
      console.error("Register error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    delete api.defaults.headers.common["Authorization"]; // Xóa header
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userInfo");
  };

  const isLoggedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const storedUserInfo = await SecureStore.getItemAsync("userInfo");

      if (token && storedUserInfo) {
        setUserToken(token);
        setUserInfo(JSON.parse(storedUserInfo));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, register, logout, isLoading, userToken, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
