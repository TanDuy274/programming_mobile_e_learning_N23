import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import api from "../api/api";
import Toast from "react-native-toast-message";
import EmptyState from "../components/EmptyState";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";

interface CourseInCart {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  instructor: { name: string };
}

const CartScreen = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { fetchEnrollments } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState<CourseInCart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);

  const fetchCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users/cart");
      setCartItems(response.data);
      setSelectedItems([]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải giỏ hàng.",
      });
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchCartItems();
    }
  }, [isFocused, fetchCartItems]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      if (selectedItems.includes(item._id)) {
        return acc + item.price;
      }
      return acc;
    }, 0);
    setSelectedTotalPrice(total);
  }, [selectedItems, cartItems]);

  const handleRemoveItem = async (courseId: string) => {
    try {
      await api.delete(`/users/cart/${courseId}`);
      Toast.show({
        type: "success",
        text1: "Đã xóa",
        text2: "Đã xóa khóa học khỏi giỏ hàng.",
      });
      setSelectedItems((prev) => prev.filter((id) => id !== courseId));
      fetchCartItems();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể xóa khóa học.",
      });
    }
  };

  const handleToggleSelect = (courseId: string) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(courseId)) {
        // Nếu đã chọn -> bỏ chọn
        return prevSelected.filter((id) => id !== courseId);
      } else {
        // Nếu chưa chọn -> chọn
        return [...prevSelected, courseId];
      }
    });
  };

  const handleCheckout = async () => {
    // Chỉ checkout nếu có item được chọn
    if (isCheckingOut || selectedItems.length === 0) return;
    setIsCheckingOut(true);

    try {
      const response = await api.post("/enrollments/checkout", {
        courseIds: selectedItems,
      });

      Toast.show({
        type: "success",
        text1: "Thành công!",
        text2: response?.data?.message || "Đã đăng ký các khóa học đã chọn.",
      });

      await fetchEnrollments(); // Cập nhật danh sách "My Courses"

      // Cập nhật lại giỏ hàng (vì backend đã xóa) và reset selection
      await fetchCartItems();
      setSelectedItems([]);

      // Chuyển người dùng đến trang "Khóa học của tôi"
      router.push("/(tabs)/mycourses");
    } catch (error: any) {
      console.log(
        "Checkout Error:",
        error.response?.data?.message || error.message
      );
      Toast.show({
        type: "error",
        text1: "Lỗi Checkout",
        text2: error.response?.data?.message || "Không thể hoàn tất đăng ký.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderCartItem = ({ item }: { item: CourseInCart }) => {
    const isSelected = selectedItems.includes(item._id);

    return (
      <TouchableOpacity onPress={() => handleToggleSelect(item._id)}>
        <View
          // Thêm hiệu ứng viền khi được chọn
          className={`flex-row bg-white p-4 mb-4 rounded-lg border ${
            isSelected ? "border-[#55BAD3] border-1" : "border-gray-200"
          }`}
        >
          {/* Checkbox Icon*/}
          <View className="mr-3 justify-center">
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={24}
              color={isSelected ? "#55BAD3" : "#D1D5DB"}
            />
          </View>

          <Image
            source={{
              uri: item.thumbnail || "https://via.placeholder.com/100",
            }}
            className="w-20 h-20 rounded-lg bg-gray-200"
          />
          <View className="flex-1 ml-4 justify-between">
            <View>
              <Text
                className="text-md font-semibold text-gray-800"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                By {item.instructor?.name || "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-lg font-bold text-[#55BAD3]">
                ${item.price}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveItem(item._id)}>
                <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const handleSelectAll = () => {
    // Kiểm tra xem tất cả item có đang được chọn không
    const allSelected =
      cartItems.length > 0 && selectedItems.length === cartItems.length;

    if (allSelected) {
      // Nếu tất cả đã được chọn -> bỏ chọn tất cả
      setSelectedItems([]);
    } else {
      // Nếu chưa chọn hết -> chọn tất cả
      setSelectedItems(cartItems.map((item) => item._id));
    }
  };

  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/*Header*/}
      <View className="items-center p-5">
        <View className="w-8" />
        <Text className="text-xl font-bold text-gray-800">My cart</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 top-3 bg-white/70 p-2 rounded-full z-10"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* select all */}
        {cartItems.length > 0 ? (
          <TouchableOpacity
            onPress={handleSelectAll}
            className="absolute right-4 top-6"
          >
            <Text className="text-base text-[#55BAD3] font-semibold">
              {isAllSelected ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="w-16" /> // Placeholder để căn giữa Title
        )}
      </View>

      {/*Danh sách*/}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          flexGrow: 1,
          justifyContent: cartItems.length === 0 ? "center" : undefined,
        }}
        className="flex-1"
        ListEmptyComponent={
          <EmptyState
            icon="cart-outline"
            message="Giỏ hàng của bạn đang trống"
          />
        }
      />

      {/*CẬP NHẬT: Bottom Bar*/}
      <View className="p-5 bg-white border-t border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg text-gray-500">Total Selected:</Text>
          <Text className="text-3xl font-bold text-gray-900">
            ${selectedTotalPrice.toFixed(2)} {/* << HIỂN THỊ TỔNG ĐÃ CHỌN */}
          </Text>
        </View>
        <TouchableOpacity
          disabled={selectedItems.length === 0 || isCheckingOut}
          onPress={handleCheckout}
          className={`p-4 rounded-lg items-center ${
            selectedItems.length === 0 || isCheckingOut
              ? "bg-gray-400"
              : "bg-[#55BAD3]"
          }`}
        >
          {isCheckingOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              Checkout ({selectedItems.length}){" "}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
