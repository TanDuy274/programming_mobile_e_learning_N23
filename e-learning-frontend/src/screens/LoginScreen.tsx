import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { AuthContext } from "../context/AuthContext";

// Định nghĩa kiểu cho props của màn hình
type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useContext(AuthContext); // << Lấy hàm login từ context

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(email, password);
      // Nếu login thành công, AppNavigator sẽ tự động chuyển màn hình
    } catch (error) {
      Alert.alert("Đăng nhập thất bại", String(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
          Đăng nhập
        </Text>

        <TextInput
          className="bg-gray-100 p-4 rounded-lg text-lg mb-4 border border-gray-200"
          placeholder="Email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-gray-100 p-4 rounded-lg text-lg mb-6 border border-gray-200"
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-lg items-center flex-row justify-center"
          onPress={handleLogin}
          disabled={isLoggingIn} // Vô hiệu hóa nút khi đang xử lý
        >
          {isLoggingIn ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Chưa có tài khoản? </Text>
          {/* Sửa lại TouchableOpacity */}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="text-indigo-600 font-semibold">Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
