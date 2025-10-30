import React, { memo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  categoryName: string;
  color: string;
  onPress: () => void;
};

const CategoryListItem = memo(
  ({ iconName, categoryName, color, onPress }: Props) => {
    const handlePress = useCallback(() => {
      onPress();
    }, [onPress]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className="flex-row items-center bg-white p-4 rounded-lg border border-gray-200 mb-3 mx-4"
      >
        {/* Icon vùng tròn màu */}
        <View
          className="w-10 h-10 rounded-lg items-center justify-center mr-4"
          style={{ backgroundColor: color }}
        >
          <Ionicons name={iconName} size={22} color="white" />
        </View>

        {/* Tên category */}
        <Text
          className="flex-1 text-lg font-semibold text-gray-800"
          numberOfLines={1}
        >
          {categoryName}
        </Text>

        {/* Mũi tên điều hướng */}
        <Ionicons name="chevron-forward-outline" size={22} color="gray" />
      </TouchableOpacity>
    );
  }
);

/*
 Khi dùng memo(...), component trở thành một hàm ẩn danh (anonymous function).
 ESLint không thấy tên component nên cảnh báo.
 Gán displayName giúp React DevTools biết tên component này là gì — tốt cho debug và performance profiling.
*/
CategoryListItem.displayName = "CategoryListItem";

export default CategoryListItem;
