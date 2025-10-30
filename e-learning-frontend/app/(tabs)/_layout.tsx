// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs, usePathname } from "expo-router"; // << THÊM usePathname
import { Ionicons } from "@expo/vector-icons";
// import { getFocusedRouteNameFromRoute } from "@react-navigation/native"; // Không cần nữa

export default function TabLayout() {
  const pathname = usePathname(); // Hook để lấy đường dẫn hiện tại

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ẩn header mặc định của Tabs
        tabBarActiveTintColor: "#55BAD3",
        tabBarInactiveTintColor: "gray",
        // Có thể ẩn thanh tab trên các màn hình con nếu cần
        // tabBarVisible: !pathname.startsWith('/course/') // Ví dụ: Ẩn tab khi vào chi tiết khóa học
      }}
    >
      <Tabs.Screen
        name="home" // Sẽ khớp với file app/(tabs)/home.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search" // Sẽ khớp với file app/(tabs)/search.tsx
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        // Tên file KHÔNG được có khoảng trắng
        name="mycourses" // Sẽ khớp với file app/(tabs)/mycourses.tsx
        options={{
          title: "My Courses", // Title hiển thị trên tab
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Sẽ khớp với file app/(tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
