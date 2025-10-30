import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BaseToastProps } from "react-native-toast-message";

export const SuccessToast = ({ text1, text2, onPress }: BaseToastProps) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    className="w-[90%] bg-green-500 rounded-lg shadow-md p-4 flex-row items-center mt-10"
  >
    {/* Icon */}
    <Ionicons
      name="checkmark-circle"
      size={24}
      color="white"
      className="mr-3"
    />
    {/* Text */}
    <View className="flex-1">
      {text1 && <Text className="text-white font-bold text-base">{text1}</Text>}
      {text2 && <Text className="text-white text-sm mt-1">{text2}</Text>}
    </View>
  </TouchableOpacity>
);

export const ErrorToast = ({ text1, text2, onPress }: BaseToastProps) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    className="w-[90%] bg-red-500 rounded-lg shadow-md p-4 flex-row items-center  mt-10"
  >
    <Ionicons name="alert-circle" size={24} color="white" className="mr-3" />
    <View className="flex-1">
      {text1 && <Text className="text-white font-bold text-base">{text1}</Text>}
      {text2 && <Text className="text-white text-sm mt-1">{text2}</Text>}
    </View>
  </TouchableOpacity>
);

export const InfoToast = ({ text1, text2, onPress }: BaseToastProps) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    className="w-[90%] bg-blue-500 rounded-lg shadow-md p-4 flex-row items-center  mt-10"
  >
    <Ionicons name="alert-circle" size={24} color="white" className="mr-3" />
    <View className="flex-1">
      {text1 && <Text className="text-white font-bold text-base">{text1}</Text>}
      {text2 && <Text className="text-white text-sm mt-1">{text2}</Text>}
    </View>
  </TouchableOpacity>
);

export const toastConfig = {
  /*
    Ghi đè type 'success' mặc định.
    props sẽ chứa các giá trị bạn truyền vào Toast.show() (text1, text2, onPress,...)
  */
  success: (props: BaseToastProps) => <SuccessToast {...props} />,

  /*
    Ghi đè type 'error' mặc định.
  */
  error: (props: BaseToastProps) => <ErrorToast {...props} />,

  info: (props: BaseToastProps) => <InfoToast {...props} />,
};
