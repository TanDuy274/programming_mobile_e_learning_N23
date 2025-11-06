import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
};

const Header = ({ title, showBackButton = false }: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between p-5 bg-white border-b border-gray-200">
      {/* Nút Quay lại */}
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
      ) : (
        <View className="w-8" />
      )}

      {/* Tiêu đề */}
      <Text className="text-xl font-bold text-gray-800">{title}</Text>

      {/* Icon bên phải */}
      <TouchableOpacity
        className="p-1"
        onPress={() => router.push("/notification")}
      >
        <Ionicons name="notifications-outline" size={26} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
