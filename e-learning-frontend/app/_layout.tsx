// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import { AuthProvider } from "@/context/AuthContext";
import "../global.css";
import { toastConfig } from "@/components/CustomToast";

// Font setup (Nếu bạn dùng custom font với expo-font)
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync(); // Giữ splash screen

export default function RootLayout() {
  // Logic load font (nếu có)
  // const [fontsLoaded, fontError] = useFonts({
  //   'YourFont-Regular': require('../assets/fonts/YourFont-Regular.ttf'),
  // });

  // const onLayoutRootView = React.useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null; // Hoặc màn hình loading
  // }

  // Bọc các Provider cần thiết
  return (
    // <View style={{ flex: 1 }} onLayout={onLayoutRootView}> // Nếu dùng splash screen
    <SafeAreaProvider>
      <MenuProvider>
        <AuthProvider>
          {/* Stack Navigator gốc */}
          <Stack
            screenOptions={{
              headerShown: false, // Ẩn header mặc định
            }}
          >
            {/*
                Expo Router sẽ tự động thêm các màn hình/nhóm từ thư mục app.
                Chúng ta không cần khai báo <Stack.Screen> ở đây trừ khi
                muốn ghi đè options cụ thể cho một route cấp cao nhất.
              */}
            {/* Ví dụ: Nếu muốn Cart có header */}
            {/* <Stack.Screen name="cart" options={{ headerShown: true, title: 'My Cart' }} /> */}

            {/* Các nhóm (auth), (tabs) sẽ có layout riêng */}
          </Stack>
          <Toast config={toastConfig} />
        </AuthProvider>
      </MenuProvider>
    </SafeAreaProvider>
    // </View> // Nếu dùng splash screen
  );
}
