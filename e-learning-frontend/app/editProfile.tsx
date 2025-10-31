import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const EditProfileScreen = () => {
  const router = useRouter();
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const [name, setName] = useState(userInfo?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Tên không được để trống.",
      });
      return;
    }
    setIsUpdating(true);
    try {
      const response = await api.put("/users/profile", { name });
      await updateUserInfo(response.data);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Thông tin của bạn đã được cập nhật.",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể cập nhật thông tin.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center p-2 border-b border-gray-200">
        <View className="w-1/5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-3 self-start"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="w-3/5 items-center">
          <Text className="text-xl font-bold text-gray-800">
            Chỉnh sửa thông tin
          </Text>
        </View>

        <View className="w-1/5" />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-5 justify-center">
          {/*Form nhập liệu*/}
          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-600 mb-2">
              Tên hiển thị
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="bg-white p-4 rounded-lg text-[16px] border border-gray-300"
              placeholder="Nhập tên của bạn"
            />
          </View>

          <View className="mb-8">
            <Text className="text-base font-semibold text-gray-600 mb-2">
              Email
            </Text>
            <TextInput
              value={userInfo?.email}
              editable={false}
              className="bg-gray-200 p-4 rounded-lg text-[16px] border border-gray-300 text-gray-500"
            />
          </View>

          {/*Nút Lưu (giữ nguyên)*/}
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isUpdating}
            className="bg-[#55BAD3] p-4 rounded-lg items-center justify-center flex-row"
          >
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Lưu thay đổi</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
