import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  categoryName: string;
  color: string;
  onPress?: () => void;
};

const CategoryCard = ({ iconName, categoryName, color, onPress }: Props) => {
  return (
    <TouchableOpacity
      className="p-2 m-2 bg-white rounded-lg border border-gray-200 flex-row items-center flex-1"
      onPress={onPress}
    >
      <View
        className={`w-12 h-12 items-center justify-center rounded-md`}
        style={{ backgroundColor: color }}
      >
        <Ionicons name={iconName} size={24} color="white" />
      </View>
      <Text className="font-bold ml-2">{categoryName}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
