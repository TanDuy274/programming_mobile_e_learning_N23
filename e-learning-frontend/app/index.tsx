// app/index.tsx
import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

export default function StartPage() {
  const { userToken, isLoading } = useContext(AuthContext);

  console.log(
    "StartPage Render - isLoading:",
    isLoading,
    "userToken:",
    !!userToken
  );

  if (isLoading) {
    // Vẫn cần màn hình loading ban đầu
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#55BAD3" />
      </View>
    );
  }

  // Logic Redirect ban đầu
  if (userToken) {
    console.log("Redirecting to / (tabs)/home");
    return <Redirect href="/(tabs)/home" />;
  } else {
    console.log("Redirecting to / (auth)/login");
    return <Redirect href="/(auth)/login" />;
  }
}
