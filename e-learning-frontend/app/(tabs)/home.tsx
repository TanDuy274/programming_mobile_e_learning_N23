import React, { useCallback, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useFetchData } from "@/hooks/useFetchData";
import CategoryCard from "@/components/CategoryCard";
import CourseCard from "@/components/CourseCard";
import TeacherCard from "@/components/TeacherCard";
// import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import SavedCourseCard from "@/components/SavedCourseCard";
import { Lesson } from "@/types";

interface Category {
  _id: string;
  name: string;
}
interface Course {
  _id: string;
  title: string;
  instructor: { name: string };
  price: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  lessons: Lesson[];
}

const HomeScreen = () => {
  const { userInfo, cart, fetchCart, fetchEnrollments, fetchUserInfo } =
    useContext(AuthContext);
  const router = useRouter();
  const { data, isLoading, isRefreshing, onRefresh } = useFetchData([
    "/categories?limit=6",
    "/courses?sort=popular&limit=5",
    "/courses?sort=recommended&limit=5",
    "/courses?featured=1&limit=3",
    "/users/teachers?limit=10",
  ]);
  const [categoriesRes, popularRes, recommendedRes, featuredRes, teachersRes] =
    data;

  const categories = categoriesRes?.docs ?? categoriesRes ?? [];
  const popularCourses = popularRes?.docs ?? popularRes ?? [];
  const recommendedCourses = recommendedRes?.docs ?? recommendedRes ?? [];
  const featuredCourses = featuredRes?.docs ?? featuredRes ?? [];
  const teachers = teachersRes?.docs ?? teachersRes ?? [];

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#55BAD3");
      StatusBar.setBarStyle("light-content");
      fetchCart();
      fetchEnrollments();
      fetchUserInfo();
    }, [])
  );

  const cartItemCount = cart?.length || 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#55BAD3" />
      </SafeAreaView>
    );
  }

  const categoryDetails: {
    [key: string]: { icon: keyof typeof Ionicons.glyphMap; color: string };
  } = {
    "Lập trình Web": { icon: "globe-outline", color: "#1abc9c" },
    "React Native": { icon: "logo-react", color: "#61dafb" },
    "Khoa học dữ liệu": { icon: "analytics-outline", color: "#e67e22" },
    "Thiết kế UI/UX": { icon: "layers-outline", color: "#e91e63" },
    DevOps: { icon: "sync-circle-outline", color: "#16a085" },
    "Hệ quản trị CSDL": { icon: "server-outline", color: "#f39c12" },
  };

  console.log("render");

  const handleViewMore = (
    target: "categories" | "popular" | "recommended" | "featured" | "teachers"
  ) => {
    switch (target) {
      case "categories":
        router.push("/categories");
        break;

      case "popular":
        router.push({ pathname: "/course", params: { sort: "popular" } });
        break;

      case "recommended":
        router.push({
          pathname: "/course",
          params: { sort: "recommended" },
        });
        break;

      case "featured":
        router.push({ pathname: "/course", params: { featured: "1" } });
        break;

      case "teachers":
        router.push("/teacher");
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      {/* <StatusBar backgroundColor="#55BAD3" style="light" /> */}
      {/* --- Header --- */}
      <View
        className="flex-row items-center justify-between p-5 bg-[#55BAD3]"
        style={{
          backgroundColor: "#55BAD3",
          paddingTop: Constants.statusBarHeight + 30,
          // Platform.OS === "ios" ? Constants.statusBarHeight + 30 : 0,
        }}
      >
        <View>
          <Text className="text-3xl font-bold text-white">
            Hello,{" "}
            {(userInfo?.name?.length ?? 0) > 15
              ? userInfo?.name.split(" ").pop()
              : userInfo?.name || "Guest"}
            !
          </Text>

          <Text className="text-lg text-white mt-1">
            What do you want to learn today?
          </Text>
        </View>

        <View className="flex-row relative">
          {/* --- Cart --- */}
          <TouchableOpacity
            className="mr-4 relative"
            onPress={() => router.push("/cart")}
          >
            <Ionicons name="cart-outline" size={28} color="white" />
            {cartItemCount > 0 && (
              <View className="absolute -top-0.5 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* --- Notification --- */}
          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Body --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#8B5CF6"]}
          />
        }
      >
        <View className="p-5 pt-0">
          {/* --- Banner --- */}
          <View className="bg-violet-500 p-5 rounded-lg mt-4 h-56 relative overflow-hidden">
            <Text className="text-white text-xl font-bold">
              PROJECT MANAGEMENT
            </Text>
            <Text className="text-white text-2xl mt-1">20% OFF</Text>
            <TouchableOpacity className="bg-[#55BAD3] px-5 py-2 rounded-md mt-[66px] self-start h-12 justify-center">
              <Text className="text-white font-bold">JOIN NOW</Text>
            </TouchableOpacity>
            <Image
              source={require("../../assets/images/teacher.png")}
              className="absolute right-14 -bottom-5 w-28 h-48"
            />
          </View>

          {/* --- Categories --- */}
          <View className="mt-8">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold">Categories</Text>
              <TouchableOpacity onPress={() => handleViewMore("categories")}>
                <Text className="text-[#55BAD3] font-medium">View more</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories?.slice(0, 6)}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item: Category) => item._id}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }: { item: Category }) => (
                <CategoryCard
                  categoryName={item.name}
                  iconName={
                    categoryDetails[item.name]?.icon || "help-circle-outline"
                  }
                  color={categoryDetails[item.name]?.color || "#bdc3c7"}
                  onPress={() =>
                    router.push({
                      pathname: "/course",
                      params: { categoryId: item._id, categoryName: item.name },
                    })
                  }
                />
              )}
            />
          </View>

          {/* --- Popular Courses --- */}
          <View className="mt-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">Popular courses</Text>
              <TouchableOpacity onPress={() => handleViewMore("popular")}>
                <Text className="text-[#55BAD3] font-medium">View more</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularCourses}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Course) => item._id}
              renderItem={({ item }: { item: Course }) => {
                const randomBestSeller = Math.random() < 0.5;
                return (
                  <CourseCard
                    id={item._id}
                    title={item.title}
                    instructor={item.instructor?.name || "N/A"}
                    price={item.price}
                    rating={item.rating}
                    reviews={item.reviewCount}
                    imageUrl={item.thumbnail}
                    isBestseller={randomBestSeller}
                    lessonsCount={item.lessons.length}
                  />
                );
              }}
            />
          </View>

          {/* --- Recommended for you --- */}
          <View className="mt-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">Recommended for you</Text>
              <TouchableOpacity onPress={() => handleViewMore("recommended")}>
                <Text className="text-[#55BAD3] font-medium">View more</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recommendedCourses}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Course) => item._id}
              renderItem={({ item }: { item: Course }) => (
                <CourseCard
                  id={item._id}
                  title={item.title}
                  instructor={item.instructor?.name || "N/A"}
                  price={item.price}
                  rating={item.rating}
                  reviews={item.reviewCount}
                  imageUrl={item.thumbnail}
                  lessonsCount={item.lessons.length}
                />
              )}
            />
          </View>

          {/* Course that inspires */}
          <View className="mt-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">Course that inspires</Text>
              <TouchableOpacity onPress={() => handleViewMore("featured")}>
                <Text className="text-[#55BAD3] font-medium">View more</Text>
              </TouchableOpacity>
            </View>
            {/* <FlatList
              data={courses.slice(0, 3)}
              // horizontal
              // showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Course) => item._id}
              renderItem={({ item }: { item: Course }) => (
                <SavedCourseCard
                  id={item._id}
                  title={item.title}
                  instructor={item.instructor?.name || "N/A"}
                  price={item.price}
                  rating={item.rating}
                  reviews={item.reviewCount}
                  imageUrl={item.thumbnail}
                  lessonsCount={item.lessons.length}
                />
              )}
            /> */}
            <View>
              {featuredCourses?.map((item: Course) => (
                <SavedCourseCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  instructor={item.instructor?.name || "N/A"}
                  price={item.price}
                  rating={item.rating}
                  reviews={item.reviewCount}
                  imageUrl={item.thumbnail}
                  lessonsCount={item.lessons.length}
                />
              ))}
            </View>
          </View>

          {/* --- Top Teachers --- */}
          <View className="mt-8 mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">Top teachers</Text>
              <TouchableOpacity onPress={() => handleViewMore("teachers")}>
                <Text className="text-[#55BAD3] font-medium">View more</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={teachers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => item._id}
              renderItem={({ item }: { item: any }) => (
                <TeacherCard
                  id={item._id}
                  name={item.name}
                  avatarUrl={item.avatar}
                  rating={4.5}
                  reviews={1233}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
