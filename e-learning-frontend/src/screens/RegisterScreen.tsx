import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../navigation/AuthNavigator";

// Định nghĩa kiểu
type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    Alert.alert("Đăng ký", `Name: ${name}, Email: ${email}`);
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
          className="bg-indigo-600 p-4 rounded-lg items-center"
          onPress={handleRegister}
        >
          <Text className="text-white text-lg font-bold">Đăng ký</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Đã có tài khoản? </Text>
          {/* Sửa lại TouchableOpacity */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-indigo-600 font-semibold">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
