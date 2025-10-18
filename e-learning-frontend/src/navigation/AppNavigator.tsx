import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";

import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import { AuthContext } from "../context/AuthContext";

const AppNavigator = () => {
  // Kết nối vào "Wi-Fi" để lấy thông tin đăng nhập
  const { userToken, isLoading } = useContext(AuthContext);

  // Nếu đang trong quá trình kiểm tra token, hiển thị màn hình loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Nếu có token thì vào màn hình chính, không thì vào màn hình đăng nhập */}
      {userToken !== null ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
