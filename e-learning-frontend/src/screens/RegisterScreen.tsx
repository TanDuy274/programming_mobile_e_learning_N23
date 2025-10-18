import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { AuthContext } from "../context/AuthContext"; // << Import AuthContext

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // << Thêm state để xử lý loading

  const { register } = useContext(AuthContext); // << Lấy hàm register từ context

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setIsRegistering(true);
    try {
      // Gọi hàm register từ context
      await register(name, email, password);
      // Nếu đăng ký thành công, AppNavigator sẽ tự động chuyển vào màn hình chính
    } catch (error) {
      // Bắt lỗi và hiển thị thông báo cụ thể
      Alert.alert("Đăng ký thất bại", String(error));
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
          Tạo tài khoản
        </Text>

        <TextInput
          className="bg-gray-100 p-4 rounded-lg text-lg mb-4 border border-gray-200"
          placeholder="Tên của bạn"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
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
          onPress={handleRegister}
          disabled={isRegistering} // Vô hiệu hóa nút khi đang xử lý
        >
          {isRegistering ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Đăng ký</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-indigo-600 font-semibold">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
