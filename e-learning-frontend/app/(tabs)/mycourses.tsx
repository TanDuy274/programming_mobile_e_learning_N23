import React, { useCallback, useState } from "react";
import api from "@/api/api";
import CourseProgressCard from "@/components/CourseProgressCard";
import EmptyState from "@/components/EmptyState";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  RefreshControl,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    thumbnail: string;
    lessons: any[];
    totalDurationMinutes: number;
  };
  progress: number;
}

const CourseList = ({
  courses,
  onRefresh,
  refreshing,
}: {
  courses: Enrollment[];
  onRefresh: () => void;
  refreshing: boolean;
}) => (
  <FlatList
    data={courses}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <CourseProgressCard
        courseId={item.course._id}
        title={item.course.title}
        imageUrl={item.course.thumbnail}
        progress={item.progress}
        totalDurationMinutes={item.course.totalDurationMinutes || 0}
      />
    )}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={["#4F46E5"]}
        tintColor={"#4F46E5"}
      />
    }
    contentContainerStyle={{ padding: 16 }}
    ListEmptyComponent={
      <EmptyState
        icon="school-outline"
        message="There are no courses in this section yet."
      />
    }
  />
);

const MyCoursesScreen = () => {
  const layout = useWindowDimensions();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cấu hình cho TabView
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "ALL" },
    { key: "ongoing", title: "ON GOING" },
    { key: "completed", title: "COMPLETED" },
  ]);

  const fetchMyCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/enrollments/my-courses");
      setEnrollments(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to load courses.",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyCourses();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchMyCourses();
  }, []);

  const ongoingCourses = enrollments.filter((e) => e.progress < 100);
  const completedCourses = enrollments.filter((e) => e.progress === 100);

  // Map các route với component tương ứng
  const renderScene = SceneMap({
    all: () => (
      <CourseList
        courses={enrollments}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    ),
    ongoing: () => (
      <CourseList
        courses={ongoingCourses}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    ),
    completed: () => (
      <CourseList
        courses={completedCourses}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    ),
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="p-5 bg-white">
          <Text className="text-xl font-bold text-center text-gray-800">
            My Courses
          </Text>
        </View>
        <View className="p-4">
          <View className="flex-row items-center bg-white p-4 rounded-xl border border-gray-200 mb-4">
            <SkeletonLoader width={96} height={96} />
            <View className="flex-1 ml-4">
              <SkeletonLoader width={200} height={20} />
              <SkeletonLoader width={100} height={16} className="mt-2" />
              <SkeletonLoader width={220} height={8} className="mt-3" />
            </View>
          </View>
          <View className="flex-row items-center bg-white p-4 rounded-xl border border-gray-200 mb-4">
            <SkeletonLoader width={96} height={96} />
            <View className="flex-1 ml-4">
              <SkeletonLoader width={200} height={20} />
              <SkeletonLoader width={100} height={16} className="mt-2" />
              <SkeletonLoader width={220} height={8} className="mt-3" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="p-5">
        <Text className="text-xl font-bold text-center text-gray-800">
          My Courses
        </Text>
      </View>

      {/* Banner */}
      <View className="mx-5 my-4 bg-indigo-600 p-5 rounded-2xl flex-row items-center justify-between h-[140px]">
        <View>
          <Text className="text-white text-xl font-bold">
            Courses that boost{"\n"}your career!
          </Text>
          <TouchableOpacity className="bg-white px-4 py-2 rounded-md mt-4 self-start">
            <Text className="text-indigo-600 font-bold">Check Now</Text>
          </TouchableOpacity>
        </View>
        {/* Có thể thêm ảnh người ở đây nếu muốn */}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...(props as any)}
            indicatorStyle={{ backgroundColor: "#55BAD3", height: 3 }}
            style={{
              backgroundColor: "white",
              elevation: 0,
              shadowOpacity: 0,
              marginHorizontal: 16,
            }}
            activeColor="#55BAD3"
            inactiveColor="gray"
            renderLabel={({
              route,
              color,
            }: {
              route: { title: string };
              color: string;
            }) => (
              <Text
                style={{
                  color,
                  fontWeight: "600",
                  width: 100,
                  textAlign: "center",
                }}
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MyCoursesScreen;
