import api from "@/api/api";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { AuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Toast from "react-native-toast-message";

interface TeacherProfile {
  _id: string;
  name: string;
  avatar?: string;
  headline?: string;
  followers: string[];
}

interface CourseForCard {
  _id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  category: { name: string };
  lessonsCount: number;
}

const groupCoursesByCategory = (courses: CourseForCard[]) => {
  return courses.reduce(
    (acc, course) => {
      const categoryName = course.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(course);
      return acc;
    },
    {} as { [key: string]: CourseForCard[] }
  );
};

const TeacherProfileScreen = () => {
  const router = useRouter();
  const layout = useWindowDimensions();
  const { teacherId } = useLocalSearchParams<{ teacherId: string }>();

  const { userInfo, fetchUserInfo } = useContext(AuthContext);

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [courses, setCourses] = useState<CourseForCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [index, setIndex] = useState(1); // Mặc định hiển thị tab COURSES
  const [routes] = useState([
    { key: "overview", title: "OVERVIEW" },
    { key: "courses", title: "COURSES" },
    { key: "review", title: "REVIEW" },
  ]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/users/teacher/${teacherId}`);
        setTeacher(response.data.teacher);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacherData();
  }, [teacherId]);

  useEffect(() => {
    if (teacher && userInfo?.following) {
      const alreadyFollowing = userInfo.following.includes(teacher._id);
      setIsFollowing(alreadyFollowing);
    }
  }, [teacher, userInfo]);

  const handleToggleFollow = async () => {
    if (isFollowLoading || !teacher) return;
    setIsFollowLoading(true);

    try {
      setIsFollowing((prev) => !prev);
      setTeacher((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          followers: isFollowing
            ? prev.followers.filter((id) => id !== userInfo?._id)
            : [...prev.followers, userInfo?._id || ""],
        };
      });

      const response = await api.post(`/users/follow/${teacherId}`);
      Toast.show({
        type: "success",
        text1: response.data.message,
      });
      if (fetchUserInfo) {
        await fetchUserInfo();
      }
    } catch (error: any) {
      setIsFollowing((prev) => !prev);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message || "Unable to perform this action.",
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const OverviewTab = () => (
    <ScrollView
      className="bg-white flex-1" // Thêm flex-1
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xl font-bold mb-2">About me</Text>
      <Text className="text-base text-gray-600 leading-6">
        {teacher?.headline || "This instructor hasn't added a biography yet."}
      </Text>
    </ScrollView>
  );

  const CoursesTab = () => {
    const groupedCourses = groupCoursesByCategory(courses);
    const categories = Object.keys(groupedCourses);

    return (
      // Giữ ScrollView dọc cho các danh mục
      <ScrollView
        className="bg-white flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc chính
      >
        {categories.map((categoryName) => (
          <View key={categoryName} className="mb-8">
            {/* --- Phần tiêu đề danh mục (Giữ nguyên) --- */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">{categoryName}</Text>
              <TouchableOpacity>
                <Text className="text-[#55BAD3]">View all</Text>
              </TouchableOpacity>
            </View>

            {/* --- THAY THẾ: Dùng FlatList ngang cho khóa học --- */}
            <FlatList
              data={groupedCourses[categoryName]}
              keyExtractor={(item) => item._id}
              horizontal // << QUAN TRỌNG: Đặt thành ngang
              showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
              renderItem={({ item }) => (
                // Đặt chiều rộng cố định hoặc minWidth cho card để cuộn ngang đẹp hơn

                <CourseCard
                  id={item._id}
                  title={item.title}
                  instructor={teacher?.name || ""}
                  price={item.price}
                  rating={item.rating}
                  reviews={item.reviewCount}
                  imageUrl={item.thumbnail}
                  lessonsCount={item.lessonsCount}
                  // layout="vertical" // Giữ layout vertical cho card
                />
              )}
              // Thêm padding bên phải nếu cần để card cuối không bị sát mép
              contentContainerStyle={{ paddingRight: 16 }}
            />
            {/* ----------------------------------------------- */}
          </View>
        ))}
      </ScrollView>
    );
  };

  const ReviewTab = () => (
    <View className="bg-white flex-1 items-center justify-center p-4">
      <EmptyState icon="star-outline" message="No reviews available." />
    </View>
  );

  // Map các key với component
  const renderScene = SceneMap({
    overview: OverviewTab,
    courses: CoursesTab,
    review: ReviewTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#55BAD3", height: 3 }}
      style={{
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        marginHorizontal: 16,
      }}
      activeColor="#55BAD3"
      inactiveColor="gray"
      labelStyle={{ fontWeight: "600", textTransform: "uppercase" }}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#55BAD3" />
      </SafeAreaView>
    );
  }

  if (!teacher) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>No teacher found.</Text>
      </SafeAreaView>
    );
  }

  const followerCount = teacher.followers?.length || 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center pt-1 pb-3">
        <View className="w-8" />
        <Text className="text-xl font-bold text-gray-800">
          Teacher{"'"}s profile
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 bg-white/70 p-2 rounded-full z-10"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* --- Banner & Avatar Section --- */}
      <View>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
          }}
          className="w-full h-[160px] p-2 rounded-2xl"
        />
        <View className="items-center -mt-12">
          <Image
            source={{
              uri: teacher.avatar || "https://i.imgur.com/6VBx3io.png",
            }}
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </View>
      </View>

      {/* --- Teacher Info Section --- */}
      <View className="items-center mt-4 px-5">
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold">{teacher.name}</Text>
          <View className="bg-cyan-500 rounded-full px-3 py-1 ml-2">
            <Text className="text-white text-xs font-semibold ">Teacher</Text>
          </View>
        </View>
        <Text className="text-md text-gray-500 mt-1">
          {teacher.headline || "Instructor"}
        </Text>
        <View className="flex-row items-center justify-center mt-4 space-x-4">
          <View className="items-center px-4">
            <Text className="text-xl font-bold">{followerCount}</Text>
            <Text className="text-sm text-gray-500">Followers</Text>
          </View>
          <View className="border-l border-gray-200 h-8" />
          <View className="items-center px-4">
            <Text className="text-xl font-bold">{courses.length}</Text>
            <Text className="text-sm text-gray-500">Courses</Text>
          </View>
          <TouchableOpacity
            onPress={handleToggleFollow}
            disabled={isFollowLoading}
            className={`rounded-full px-5 py-2 ${
              isFollowing ? "bg-[#55BAD3]" : "border border-[#55BAD3]"
            } ${isFollowLoading ? "opacity-50" : ""}`}
          >
            <Text
              className={`font-semibold ${
                isFollowing ? "text-white" : "text-[#55BAD3]"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Dùng TabView --- */}
      <View className="flex-1 mt-6">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};

export default TeacherProfileScreen;
