import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  message: string;
};

const EmptyState = ({ icon, message }: EmptyStateProps) => {
  return (
    <View className="flex-1 justify-center items-center mt-20 p-5">
      <Ionicons name={icon} size={80} color="lightgray" />
      <Text className="text-gray-500 text-base text-center mt-4">
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;
