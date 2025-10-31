import React, { memo, useCallback, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

type SavedCourseCardProps = {
  id: string;
  title: string;
  instructor: string;
  price: number;
  rating: number;
  reviews: number;
  lessonsCount: number;
  imageUrl?: string;
};

const FALLBACK_IMAGE = "https://via.placeholder.com/100x100";

const SavedCourseCard = memo(
  ({
    id,
    title,
    instructor,
    price,
    rating,
    reviews,
    lessonsCount,
    imageUrl = FALLBACK_IMAGE,
  }: SavedCourseCardProps) => {
    const router = useRouter();
    const { savedCourses, toggleSaveCourse } = useContext(AuthContext);
    const isSaved = savedCourses.includes(id);

    // --- SỬA LẠI handlePress ---
    const handlePress = useCallback(() => {
      router.push(`/course/${id}`); // << Sử dụng router.push với đường dẫn file
    }, [router, id]); // << Cập nhật dependency
    // -------------------------

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className="mb-4"
      >
        {/* Bố cục ngang */}
        <View className="flex-row bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm p-3 items-center">
          {/* Ảnh khoá học (nhỏ hơn) */}
          <Image
            source={{ uri: imageUrl }}
            className="w-20 h-20 rounded-lg mr-3"
            resizeMode="cover"
          />

          {/* Cột thông tin */}
          <View className="flex-1 justify-between">
            <Text
              className="text-base font-bold text-gray-800"
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">{instructor}</Text>
            <Text className="text-lg font-bold text-[#55BAD3] mt-1">
              ${price.toFixed(2)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text className="text-xs text-gray-500 ml-1">
                {rating?.toFixed(1) ?? "0.0"} ({reviews})
              </Text>
              <Text className="text-xs text-gray-500 ml-2">
                {lessonsCount} lessons
              </Text>
            </View>
          </View>

          {/* Nút Bookmark (bên phải cùng) */}
          <TouchableOpacity
            onPress={() => toggleSaveCourse(id)}
            className="p-2 ml-2 self-start"
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? "#55BAD3" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
);

/*
 Khi dùng memo(...), component trở thành một hàm ẩn danh (anonymous function).
 ESLint không thấy tên component nên cảnh báo.
 Gán displayName giúp React DevTools biết tên component này là gì — tốt cho debug và performance profiling.
*/
SavedCourseCard.displayName = "SavedCourseCard";

export default SavedCourseCard;
