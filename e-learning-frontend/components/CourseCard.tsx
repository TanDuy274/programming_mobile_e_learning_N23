import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

type CourseCardProps = {
  id: string;
  title: string;
  instructor: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl?: string;
  isBestseller?: boolean;
  layout?: "horizontal" | "vertical";
  lessonsCount: number;
};

const FALLBACK_IMAGE = "https://via.placeholder.com/256x144";

const CourseCard = memo(
  ({
    id,
    title,
    instructor,
    price,
    rating,
    reviews,
    imageUrl = FALLBACK_IMAGE,
    isBestseller = false,
    layout = "horizontal",
    lessonsCount,
  }: CourseCardProps) => {
    const router = useRouter();
    const isHorizontal = layout === "horizontal";
    const { savedCourses, toggleSaveCourse } = useContext(AuthContext);

    const isSaved = savedCourses.includes(id);

    const handlePress = useCallback(() => {
      router.push(`/course/${id}`);
    }, [router, id]);
    // ------------------------------------------

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className={isHorizontal ? "w-64 mr-4" : "w-full mb-4"}
      >
        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Ảnh khoá học */}
          <Image
            source={{ uri: imageUrl }}
            className={isHorizontal ? "w-full h-36" : "w-full h-48"}
            resizeMode="cover"
          />

          {/* Gắn cờ Best-seller */}
          {isBestseller && (
            <View className="absolute top-2 left-2 bg-blue-500 px-2 py-1 rounded-md">
              <Text className="text-white text-xs font-bold">Best-seller</Text>
            </View>
          )}

          {/* Thông tin khoá học */}
          <View className="p-4">
            <Text
              className="text-lg font-bold text-gray-800 min-h-[48px] max-w-[80%]" // Giữ lại max-w để tránh đè nút bookmark
              numberOfLines={2}
            >
              {title}
            </Text>
            {/* Nút Bookmark */}
            <TouchableOpacity
              onPress={() => toggleSaveCourse(id)}
              className="absolute top-3 right-3 bg-white/70 p-1.5 rounded-full z-10"
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? "#55BAD3" : "black"}
              />
            </TouchableOpacity>

            <Text className="text-sm text-gray-500 mt-1">{instructor}</Text>

            <Text className="text-xl font-bold text-[#55BAD3] mt-2">
              ${price.toFixed(2)}
            </Text>

            <View className="flex-row items-center mt-2">
              <Text className="text-yellow-500 font-bold mr-1">
                {rating?.toFixed(1) ?? "0.0"}
              </Text>
              <Ionicons name="star" size={16} color="#FBBF24" />
              <Text className="text-xs text-gray-400 ml-2">({reviews})</Text>
              <Text className="text-xs text-gray-500 ml-2">
                {lessonsCount} lessons
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

export default CourseCard;
