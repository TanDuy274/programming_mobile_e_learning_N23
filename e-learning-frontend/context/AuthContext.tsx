import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";
import Toast from "react-native-toast-message";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  following: string[];
  savedCourses: string[];
  avatar?: string;
}

interface Enrollment {
  _id: string;
  course: any;
  progress: number;
}

interface CourseInCart {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  instructor: { name: string };
}

interface AuthContextType {
  userToken: string | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  enrollments: Enrollment[];
  fetchEnrollments: () => Promise<void>;

  updateUserInfo: (newUserInfo: UserInfo) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  savedCourses: string[];
  toggleSaveCourse: (courseId: string) => Promise<void>;

  cart: CourseInCart[];
  fetchCart: () => Promise<void>;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [cart, setCart] = useState<CourseInCart[]>([]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;

      setUserToken(token);
      setUserInfo(userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userInfo", JSON.stringify(userData));

      await Promise.all([fetchEnrollments(), fetchCart(), fetchUserInfo()]);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }
  };

  const register = async (name: string, email: string, password: string) => {
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
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";
      console.error("Register error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    setEnrollments([]);
    setSavedCourses([]);
    setCart([]);
    delete api.defaults.headers.common["Authorization"];
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

        await Promise.all([fetchEnrollments(), fetchCart()]);
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await api.get("/enrollments/my-courses");
      setEnrollments(response.data);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    }
  };

  const updateUserInfo = async (newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
    await SecureStore.setItemAsync("userInfo", JSON.stringify(newUserInfo));
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/auth/me");
      setUserInfo(response.data);
      setSavedCourses(response.data.savedCourses || []);
      await SecureStore.setItemAsync("userInfo", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const toggleSaveCourse = async (courseId: string) => {
    try {
      await api.put("/users/save-course", { courseId });
      await fetchUserInfo();

      Toast.show({
        type: "success",
        text1: "Cập nhật thành công!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Đã có lỗi xảy ra.",
      });
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get("/users/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart([]);
    }
  };

  const addToCart = async (courseId: string) => {
    try {
      await api.post("/users/cart", { courseId });
      await fetchCart(); // Tải lại giỏ hàng
      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
      });
    } catch (error: any) {
      console.error("Add to cart error:", error);
      Toast.show({
        type: error.response?.status === 400 ? "info" : "error",
        text1: error.response?.data?.message || "Lỗi khi thêm vào giỏ",
      });
      throw error;
    }
  };

  const removeFromCart = async (courseId: string) => {
    try {
      await api.delete(`/users/cart/${courseId}`);
      await fetchCart();
      Toast.show({
        type: "success",
        text1: "Đã xóa khỏi giỏ hàng",
      });
    } catch (error: any) {
      console.error("Remove from cart error:", error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Lỗi khi xóa",
      });
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      login,
      register,
      logout,
      isLoading,
      userToken,
      userInfo,
      enrollments,
      fetchEnrollments,
      updateUserInfo,
      fetchUserInfo,
      savedCourses,
      toggleSaveCourse,
      cart,
      fetchCart,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [isLoading, userToken, userInfo, enrollments, savedCourses, cart]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
