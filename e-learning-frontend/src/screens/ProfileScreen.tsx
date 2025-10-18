// Ví dụ: src/screens/SearchScreen.tsx
import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-2xl font-bold mb-8">Trang cá nhân</Text>

        <TouchableOpacity
          className="bg-red-500 w-full p-4 rounded-lg items-center"
          onPress={() => logout()}
        >
          <Text className="text-white text-lg font-bold">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
