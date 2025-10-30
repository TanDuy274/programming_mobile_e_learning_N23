import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { formatDuration } from "../utils/formatDuration";

type Props = {
  courseId: string;
  title: string;
  totalDurationMinutes: number;
  progress: number;
  imageUrl?: string;
};

const FALLBACK_IMAGE = "https://via.placeholder.com/100";

const CourseProgressCard = ({
  courseId,
  title,
  totalDurationMinutes,
  progress,
  imageUrl = FALLBACK_IMAGE,
}: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      // --- SỬA LẠI onPress ---
      onPress={() => router.push(`/course/${courseId}`)} // << Sử dụng router.push với đường dẫn file
      // ----------------------
      className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4"
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-28 h-28 rounded-lg"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-between self-stretch">
        <View>
          <Text className="text-base font-bold text-gray-800" numberOfLines={2}>
            {title}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {formatDuration(totalDurationMinutes)}
          </Text>
        </View>
        <View className="mt-2 gap-2">
          <Text className="text-xs text-gray-500 mt-1">
            {progress}% Complete
          </Text>
          <View className="w-full bg-[#B7F3FD] rounded-full h-1.5">
            <View
              className="bg-[#55BAD3] h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CourseProgressCard);
