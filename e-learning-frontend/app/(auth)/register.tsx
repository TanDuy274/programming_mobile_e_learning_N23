import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  // --- THÊM CÁC IMPORTS ---
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView, // << THÊM ScrollView
  // -----------------------
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useContext(AuthContext);

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự.";
      isValid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Vui lòng nhập một địa chỉ email hợp lệ.";
      isValid = false;
    }

    if (!password || password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    setIsRegistering(true);
    try {
      await register(name.trim(), email.trim(), password);
      // Hiển thị Toast thành công SAU khi register thành công
      Toast.show({
        type: "success",
        text1: "Đăng ký thành công!",
        text2: `Chào mừng ${name.trim()} 👋`,
      });
      router.replace("/(tabs)/home");
      // AppNavigator sẽ tự chuyển màn hình nếu register thành công
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Đăng ký thất bại",
        text2: String(error) || "Email có thể đã tồn tại.", // Thông báo lỗi rõ hơn
      });
      // Không cần Alert vì đã có Toast
      // Alert.alert("Đăng ký thất bại", String(error));
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    // --- 1. BỌC BÊN NGOÀI BẰNG TouchableWithoutFeedback ---
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        {/* --- 2. SỬ DỤNG KeyboardAvoidingView --- */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* --- 3. THÊM ScrollView --- */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
          >
            {/* Giữ nguyên View chứa nội dung */}
            <View className="p-6">
              <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
                Tạo tài khoản
              </Text>

              {/* --- NAME INPUT --- */}
              <TextInput
                className={`bg-gray-100 p-4 rounded-lg text-lg border ${errors.name ? "border-red-500" : "border-gray-200"}`}
                placeholder="Tên của bạn"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              {
                errors.name ? ( // Chỉ render Text nếu có lỗi
                  <Text className="text-red-500 mt-1 mb-2">{errors.name}</Text>
                ) : (
                  <View className="h-5 mb-2" />
                ) /* Giữ khoảng trống */
              }

              {/* --- EMAIL INPUT --- */}
              <TextInput
                className={`bg-gray-100 p-4 rounded-lg text-lg border ${errors.email ? "border-red-500" : "border-gray-200"}`}
                placeholder="Email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? (
                <Text className="text-red-500 mt-1 mb-2">{errors.email}</Text>
              ) : (
                <View className="h-5 mb-2" />
              )}

              {/* --- PASSWORD INPUT --- */}
              <TextInput
                className={`bg-gray-100 p-4 rounded-lg text-lg border ${errors.password ? "border-red-500" : "border-gray-200"}`}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password ? (
                <Text className="text-red-500 mt-1 mb-2">
                  {errors.password}
                </Text>
              ) : (
                <View className="h-5 mb-2" />
              )}

              <TouchableOpacity
                className="bg-indigo-600 p-4 rounded-lg items-center flex-row justify-center mt-4" // Giảm margin top
                onPress={handleRegister}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-bold">Đăng ký</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-500">Đã có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/login")}
                >
                  <Text className="text-indigo-600 font-semibold">
                    Đăng nhập
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

export default RegisterScreen;
