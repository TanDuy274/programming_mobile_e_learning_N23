// Ví dụ: src/screens/SearchScreen.tsx
import api from "@/api/api";
import EmptyState from "@/components/EmptyState";
import SavedCourseCard from "@/components/SavedCourseCard";
import { AuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { logout, userInfo, savedCourses, enrollments } =
    useContext(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get safe area dimensions

  const [savedCoursesDetails, setSavedCoursesDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onGoingCount = enrollments.filter(
    (e) => e.progress > 0 && e.progress < 100
  ).length;
  const completedCount = enrollments.filter((e) => e.progress === 100).length;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchSavedCourseDetails = async () => {
        if (savedCourses.length === 0) {
          setSavedCoursesDetails([]);
          return;
        }
        setIsLoading(true);
        try {
          const response = await api.post("/courses/by-ids", {
            ids: savedCourses,
          });
          setSavedCoursesDetails(response.data);
        } catch (error: any) {
          console.error(
            "Error fetching saved course details:",
            error.response?.data || error.message
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchSavedCourseDetails();
    }, [savedCourses])
  );

  const handleLogout = async () => {
    try {
      await logout(); // Gọi hàm logout từ context
      // SAU KHI LOGOUT XONG, chuyển hướng về login
      router.replace("/(auth)/login"); // Dùng replace để xóa stack cũ
    } catch (error) {
      console.error("Error during logout navigation:", error);
      // Có thể thêm Toast báo lỗi nếu cần
    }
  };

  return (
    // Use SafeAreaView only for top inset, remove bottom padding
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right", "top"]}>
      {/* --- Custom Header --- */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white">
        <View className="w-8" />
        <Text className="text-xl font-bold text-gray-800">User's profile</Text>
        <Ionicons name="ellipsis-vertical" size={26} color="black" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-gray-50"
      >
        {/* --- Banner & Avatar Section --- */}
        <View className="bg-white">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
            }}
            className="w-full h-[200px] p-2 rounded-2xl"
          />
          {/* Overlapping Avatar */}
          <View className="items-center -mt-14" style={{ zIndex: 10 }}>
            <Image
              source={{
                // uri: `https://ui-avatars.com/api/?name=${userInfo?.name}&background=random&size=128`,
                uri: userInfo?.avatar || "https://i.imgur.com/6VBx3io.png",
              }}
              className="w-28 h-28 rounded-full border-4 border-white bg-white"
            />
          </View>
        </View>

        {/* --- User Info Section --- */}
        <View className="items-center px-5 bg-white pt-4 pb-6">
          <Text className="text-2xl font-bold text-gray-800 text-center">
            {userInfo?.name}
          </Text>
          {/* Use Title instead of Email */}
          <Text className="text-md text-gray-500 mt-1">
            {userInfo?.role || "UX/UI Designer"}
          </Text>
        </View>

        {/* --- Stats Section --- */}
        {/* Add background color and padding */}
        <View className="flex-row py-6 bg-white border-t border-b border-gray-100">
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-800">
              {savedCourses.length}
            </Text>
            {/* Change "Saved" to "Save" */}
            <Text className="text-gray-500">Save</Text>
          </View>
          <View className="w-[1px] h-full border border-gray-100"></View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-800">
              {onGoingCount}
            </Text>
            <Text className="text-gray-500">On Going</Text>
          </View>

          <View className="w-[1px] h-full border border-gray-100"></View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-800">
              {completedCount}
            </Text>
            <Text className="text-gray-500">Completed</Text>
          </View>
        </View>

        {/* --- Saved Courses Section --- */}
        <View className="px-5 pt-6 pb-10 bg-gray-50">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Saved courses
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" className="my-10" />
          ) : savedCoursesDetails.length > 0 ? (
            <View>
              {savedCoursesDetails.map((course) => (
                <SavedCourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  instructor={course.instructor.name}
                  price={course.price}
                  rating={course.rating}
                  reviews={course.reviewCount}
                  lessonsCount={course.lessons.length}
                  imageUrl={course.thumbnail}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="bookmark-outline"
              message="Bạn chưa lưu khóa học nào."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
