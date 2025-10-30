import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviews: number;
};

const TeacherCard = ({ id, name, avatarUrl, rating, reviews }: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="items-center mr-4 w-32"
      //SỬA LẠI onPress
      onPress={() => router.push(`/teacher/${id}`)} // << Sử dụng router.push với đường dẫn file
      // ----------------------
    >
      <Image source={{ uri: avatarUrl }} className="w-24 h-24 rounded-full" />
      <Text className="font-bold mt-2 text-center" numberOfLines={1}>
        {name}
      </Text>
      <View className="flex-row items-center mt-1">
        <Ionicons name="star" size={14} color="#FBBF24" />
        <Text className="text-xs text-gray-500 ml-1">
          {rating.toFixed(1)} ({reviews})
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TeacherCard;
