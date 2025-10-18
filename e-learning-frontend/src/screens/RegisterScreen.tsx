import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State để lưu các thông báo lỗi
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useContext(AuthContext);

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    // Name validation
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Vui lòng nhập một địa chỉ email hợp lệ.";
      isValid = false;
    }

    // Password validation
    if (!password || password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    // Chỉ thực hiện khi tất cả ràng buộc đều hợp lệ
    if (!validate()) {
      return;
    }

    setIsRegistering(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (error) {
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

        {/* --- NAME INPUT --- */}
        <TextInput
          className={`bg-gray-100 p-4 rounded-lg text-lg border ${errors.name ? "border-red-500" : "border-gray-200"}`}
          placeholder="Tên của bạn"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        {errors.name && (
          <Text className="text-red-500 mt-1 mb-2">{errors.name}</Text>
        )}

        {/* --- EMAIL INPUT --- */}
        <TextInput
          className={`bg-gray-100 p-4 rounded-lg text-lg mt-2 border ${errors.email ? "border-red-500" : "border-gray-200"}`}
          placeholder="Email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text className="text-red-500 mt-1 mb-2">{errors.email}</Text>
        )}

        {/* --- PASSWORD INPUT --- */}
        <TextInput
          className={`bg-gray-100 p-4 rounded-lg text-lg mt-2 border ${errors.password ? "border-red-500" : "border-gray-200"}`}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && (
          <Text className="text-red-500 mt-1 mb-2">{errors.password}</Text>
        )}

        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-lg items-center flex-row justify-center mt-6"
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
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-indigo-600 font-semibold">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
