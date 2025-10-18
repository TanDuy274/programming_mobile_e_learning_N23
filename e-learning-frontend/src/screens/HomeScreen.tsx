// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-5">
          <Text className="text-3xl font-bold text-gray-800">Hello, Duy!</Text>
          <Text className="text-lg text-gray-500 mt-1">
            What do you want to learn today?
          </Text>

          {/* Banner quảng cáo sẽ ở đây */}
          <View className="bg-purple-500 p-5 rounded-xl mt-6">
            <Text className="text-white font-bold text-xl">
              PROJECT MANAGEMENT
            </Text>
            <Text className="text-white mt-2">20% OFF</Text>
          </View>

          {/* Phần Danh mục (Categories) sẽ ở đây */}
          <Text className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            Categories
          </Text>
          {/* ...Code để render danh sách categories... */}

          {/* Phần Khóa học phổ biến (Popular Courses) sẽ ở đây */}
          <Text className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            Popular courses
          </Text>
          {/* ...Code để render danh sách khóa học... */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
