import { AuthContext } from "@/context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  // --- THÊM CÁC IMPORTS ---
  KeyboardAvoidingView, // Để đẩy layout lên
  Platform, // Để kiểm tra HĐH (iOS/Android)
  TouchableWithoutFeedback, // Để bấm ra ngoài
  Keyboard, // Để ẩn bàn phím
  ScrollView, // << THÊM ScrollView
  // -----------------------
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập đầy đủ thông tin.",
      });
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      // Sử dụng Toast thay vì Alert
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: String(error) || "Email hoặc mật khẩu không chính xác.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    // --- 1. BỌC BÊN NGOÀI BẰNG TouchableWithoutFeedback ---
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        {/* --- 2. SỬ DỤNG KeyboardAvoidingView --- */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"} // Cách đẩy layout lên
          style={{ flex: 1 }} // Cần flex: 1 để chiếm không gian
          // Bật cái này nếu dùng behavior='padding' trên iOS và có header
          // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          {/* --- 3. THÊM ScrollView (Tùy chọn nhưng tốt cho màn hình nhỏ) --- */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} // Căn giữa nội dung
            keyboardShouldPersistTaps="handled" // Quan trọng: Cho phép bấm nút bên trong ScrollView khi bàn phím hiện
          >
            {/* Giữ nguyên View chứa nội dung của bạn */}
            <View className="p-6">
              <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
                Đăng nhập
              </Text>

              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-[16px] mb-4 border border-gray-200"
                placeholder="Email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                className="bg-gray-100 p-4 rounded-lg text-[16px] mb-6 border border-gray-200"
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                className="bg-indigo-600 p-4 rounded-lg items-center flex-row justify-center"
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-bold">
                    Đăng nhập
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-500">Chưa có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/register")}
                >
                  <Text className="text-indigo-600 font-semibold">
                    Đăng ký ngay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
