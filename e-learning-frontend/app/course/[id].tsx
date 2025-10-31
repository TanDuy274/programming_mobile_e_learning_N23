import api from "@/api/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { AuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
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

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface SimilarCourse {
  _id: string;
  title: string;
  instructorName: string;
  price: number;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  lessonsCount: number;
}

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  instructor: {
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  lessons: { _id: string; title: string; duration: number }[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  benefits?: { icon: string; text: string }[];
  similarCourses?: SimilarCourse[];
}

const mockBenefits = [
  { icon: "videocam-outline", text: "14 hours on-demand video" },
  { icon: "language-outline", text: "Native teacher" },
  { icon: "document-text-outline", text: "100% free document" },
  { icon: "infinite-outline", text: "Full lifetime access" },
  { icon: "ribbon-outline", text: "Certificate of complete" },
  { icon: "headset-outline", text: "24/7 support" },
];

const mockSimilarCourses = [
  {
    _id: "sc1",
    title: "Product Design",
    instructorName: "Dennis Sweeney",
    price: 90,
    thumbnail: "https://i.imgur.com/g0GPDc6.png",
    rating: 4.5,
    reviewCount: 1233,
    lessonsCount: 1,
  },
  {
    _id: "sc2",
    title: "Palettes for Your App",
    instructorName: "Ramono Wultschner",
    price: 39,
    thumbnail: "https://i.imgur.com/ep9wGik.png", // Placeholder
    rating: 4.5,
    reviewCount: 1233,
    lessonsCount: 12,
  },
  {
    _id: "sc3",
    title: "Mobile UI Design",
    instructorName: "Sara Weise",
    price: 32,
    thumbnail: "https://i.imgur.com/qEwBG1T.png", // Placeholder
    rating: 4.5,
    reviewCount: 1233,
    lessonsCount: 10,
  },
];

const BenefitItem = ({ icon, text }: { icon: any; text: string }) => (
  <View className="flex-row items-center mb-3">
    <Ionicons name={icon} size={22} color="#55BAD3" />
    <Text className="text-base text-gray-700 ml-4">{text}</Text>
  </View>
);

const SimilarCourseCard = ({ item }: { item: SimilarCourse }) => (
  <TouchableOpacity className="mr-4 w-60">
    <Image
      source={{ uri: item.thumbnail }}
      className="w-full h-32 rounded-lg bg-gray-200"
    />
    <Text
      className="text-lg font-semibold mt-2 text-gray-800"
      numberOfLines={1}
    >
      {item.title}
    </Text>
    <Text className="text-sm text-gray-500">{item.instructorName}</Text>
    <View className="flex-row justify-between items-center mt-1">
      <Text className="text-lg font-bold text-[#55BAD3]">${item.price}</Text>

      <View className="flex-row items-center">
        <Ionicons name="star" size={14} color="#FBBF24" />
        <Text className="text-sm text-gray-500 ml-1">
          {item.rating.toFixed(1)} ({item.reviewCount})
        </Text>
        <Text className="text-xs text-gray-500 ml-2">
          |{" "}
          {item.lessonsCount === 1
            ? "1 lesson"
            : `${item.lessonsCount} lessons`}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const StarRatingDisplay = ({ rating }: { rating: number }) => (
  <View className="flex-row">
    {[1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name="star"
        size={16}
        color={star <= rating ? "#FBBF24" : "#D1D5DB"} // Vàng hoặc Xám
        style={{ marginRight: 2 }}
      />
    ))}
  </View>
);

const FilterButton = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center border rounded-full px-4 py-2 mr-2 ${
      active
        ? "bg-[#55BAD3] border-[#55BAD3]" // Style khi active
        : "bg-white border-gray-300" // Style khi inactive
    }`}
  >
    <Ionicons name="star" size={16} color={active ? "white" : "#FBBF24"} />
    <Text
      className={`font-semibold ml-1.5 ${
        active ? "text-white" : "text-gray-700"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const CourseDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const { enrollments, userInfo, fetchUserInfo } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "overview", title: "OVERVIEW" },
    { key: "lessons", title: "LESSONS" },
    { key: "review", title: "REVIEW" },
  ]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải chi tiết khóa học.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseDetail();
  }, [id]);

  useEffect(() => {
    const isAlreadyEnrolled = enrollments.some(
      (enrollment) => enrollment.course?._id === id
    );
    setIsEnrolled(isAlreadyEnrolled);
  }, [enrollments, id]);

  useEffect(() => {
    if (course && userInfo?.following) {
      const alreadyFollowing = userInfo.following.includes(
        course.instructor._id
      );
      setIsFollowing(alreadyFollowing);
    }
  }, [course, userInfo]);

  // @desc    Thêm khóa học vào giỏ hàng
  // @route   POST /api/users/cart
  const handleAddToCart = async () => {
    try {
      await api.post("/users/cart", { courseId: course?._id });

      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ",
        text2: `${course?.title} đã được thêm vào giỏ hàng.`,
      });

      // TODO: Bạn nên gọi một hàm từ Context để cập nhật lại
      // state giỏ hàng trên toàn ứng dụng (ví dụ: fetchCart())
    } catch (error: any) {
      console.log("LỖI ADD TO CART:", JSON.stringify(error.response, null, 2));
      if (error.response && error.response.status === 400) {
        Toast.show({
          type: "info",
          text1: "Already in Cart",
          text2: "This course is already in your cart.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Unable to add to cart.",
        });
      }
    }
  };

  const handleToggleFollow = async () => {
    if (isFollowLoading || !course) return;

    setIsFollowLoading(true);
    const teacherId = course.instructor._id;

    try {
      setIsFollowing((prevState) => !prevState);

      const response = await api.post(`/users/follow/${teacherId}`);

      Toast.show({
        type: "success",
        text1: response.data.message,
      });

      // Yêu cầu AuthContext tải lại thông tin user (để mảng 'following' được cập nhật)
      if (fetchUserInfo) {
        await fetchUserInfo();
      }
    } catch (error: any) {
      // Hoàn tác lại nếu có lỗi
      setIsFollowing((prevState) => !prevState);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Unable to perform action.",
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const OverviewTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20 }}
      className="bg-white"
    >
      {/* --- Instructor Block --- */}
      <View className="flex-row justify-between items-center mb-5">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push(`/teacher/${course?.instructor._id}`)}
        >
          <Image
            source={{
              uri:
                course?.instructor.avatar || "https://via.placeholder.com/50",
            }}
            className="w-12 h-12 rounded-full bg-gray-200"
          />
          <View className="ml-3">
            <Text className="text-lg font-bold text-gray-800">
              {course?.instructor.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {course?.instructor.role || "Instructor"}
            </Text>
          </View>
        </TouchableOpacity>
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

      {/* --- Description Block --- */}
      <Text className="text-xl font-bold text-gray-800 mb-2">Description</Text>
      <Text className="text-base text-gray-600 leading-6 mb-5">
        {course?.description.length! > 280 ? (
          <>
            {course?.description.slice(0, 280)}...{"  "}
            <Text className="text-[#55BAD3] font-semibold">See more</Text>
          </>
        ) : (
          <>{course?.description} </>
        )}
      </Text>

      {/* --- Benefits Block --- */}
      <Text className="text-xl font-bold text-gray-800 mb-3">Benefits</Text>
      {mockBenefits.map((item) => (
        <BenefitItem key={item.text} icon={item.icon} text={item.text} />
      ))}

      {/* --- Similar Courses Block --- */}
      <Text className="text-xl font-bold text-gray-800 mt-5 mb-3">
        Similar courses
      </Text>
      <FlatList
        data={mockSimilarCourses}
        renderItem={({ item }) => <SimilarCourseCard item={item} />}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );

  const LessonsTab = () => (
    <FlatList
      data={course?.lessons}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index: lessonIndex }) => (
        <TouchableOpacity
          key={item._id}
          // onPress={() =>
          //   navigation.navigate("Lesson", {
          //     courseId: course?._id,
          //     lessonId: item._id,
          //   })
          // }
          className="flex-row items-center p-4 mb-2 bg-gray-50 rounded-lg border border-gray-200"
        >
          <Text className="text-[#55BAD3] font-bold mr-4">
            {String(lessonIndex + 1).padStart(2, "0")}
          </Text>
          <View className="flex-1">
            <Text className="font-semibold text-base">{item.title}</Text>
            <Text className="text-gray-500 text-sm mt-1">
              {item.duration} minutes
            </Text>
          </View>
          <Ionicons name="play-circle" size={28} color="#55BAD3" />
        </TouchableOpacity>
      )}
      contentContainerStyle={{ padding: 20 }}
      className="bg-white"
    />
  );

  const ReviewTab = () => {
    // State để quản lý filter (0 = All, 1-5 = số sao)
    const [selectedFilter, setSelectedFilter] = useState(0);

    // Lọc danh sách reviews
    const filteredReviews =
      course?.reviews.filter((review) => {
        if (selectedFilter === 0) return true;
        return Math.floor(review.rating) === selectedFilter; // Lọc theo số sao
      }) || [];

    return (
      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="bg-white"
        contentContainerStyle={{ padding: 20 }}
        // Header chứa tổng quan và các nút filter
        ListHeaderComponent={
          <View>
            {/* --- Tổng quan Rating --- */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Ionicons name="star" size={24} color="#FBBF24" />
                <Text className="text-2xl font-bold text-gray-800 ml-2">
                  {course?.rating.toFixed(1)}/5
                </Text>
                <Text className="text-base text-gray-500 ml-2">
                  (
                  {course?.reviewCount === 1
                    ? "1 review"
                    : `${course?.reviewCount} reviews`}
                  )
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-base text-[#55BAD3] font-semibold">
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            {/* --- Thanh Filter --- */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              <FilterButton
                label="All"
                active={selectedFilter === 0}
                onPress={() => setSelectedFilter(0)}
              />
              {[5, 4, 3, 2, 1].map((num) => (
                <FilterButton
                  key={num}
                  label={String(num)}
                  active={selectedFilter === num}
                  onPress={() => setSelectedFilter(num)}
                />
              ))}
            </ScrollView>
          </View>
        }
        // Render từng item review
        renderItem={({ item }) => (
          <View className="mb-5 border-b border-gray-100 pb-5">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: item.user.avatar || "https://via.placeholder.com/40",
                  }}
                  className="w-10 h-10 rounded-full bg-gray-200"
                />
                <View className="ml-3">
                  <Text className="text-base font-bold text-gray-800">
                    {item.user.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
              </View>
              <StarRatingDisplay rating={item.rating} />
            </View>
            <Text className="text-base text-gray-600 leading-6">
              {item.comment}
            </Text>
          </View>
        )}
        // Fallback khi không có review
        ListEmptyComponent={
          <View className="items-center justify-center pt-10">
            <Text className="text-gray-500">
              No reviews found for the selected filter.
            </Text>
          </View>
        }
      />
    );
  };

  const renderScene = SceneMap({
    overview: OverviewTab,
    lessons: LessonsTab,
    review: ReviewTab,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <SkeletonLoader width={400} height={225} />
        <View className="p-5">
          <SkeletonLoader width={300} height={28} />
          <SkeletonLoader width={150} height={20} className="mt-2" />
          <View className="flex-row mt-2">
            <SkeletonLoader width={100} height={20} />
          </View>
          <SkeletonLoader width={120} height={24} className="mt-6 mb-2" />
          <SkeletonLoader width={350} height={18} />
          <SkeletonLoader width={320} height={18} className="mt-1" />
          <SkeletonLoader width={340} height={18} className="mt-1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Unable to load course details. Please try again later.</Text>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* --- Header (Giữ nguyên) --- */}
      <View className="items-center pt-1 pb-3">
        <Text className="text-xl font-bold text-gray-800">Course Details</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 bg-white/70 p-2 rounded-full z-10"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Image
          source={{
            uri: course.thumbnail || "https://via.placeholder.com/400x225",
          }}
          className="w-full h-56"
        />
      </View>

      {/* --- title/rating --- */}
      <View className="p-5">
        <Text className="text-2xl font-bold text-gray-800">{course.title}</Text>
        <View className="flex-row items-center mt-2">
          <Text className="text-yellow-500 font-bold mr-1">
            {course.rating.toFixed(1)}
          </Text>
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Text className="text-sm text-gray-500 ml-2">
            (
            {course?.reviewCount === 1
              ? "1 review"
              : `${course?.reviewCount} reviews`}
            )
          </Text>
          <View className="flex-row items-center">
            <Text className="text-3xl text-gray-200 mx-2">•</Text>
            <Text className="font-normal text-gray-800">
              {course.lessons.length}
            </Text>
            <Text className="text-sm text-gray-500">
              {" "}
              {course.lessons.length === 1 ? "lesson" : "lessons"}
            </Text>
          </View>
        </View>
      </View>

      {/* --- TabView --- */}
      <View className="flex-1">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>

      {/* --- Bottom Bar (Giữ nguyên) --- */}
      <View className="p-4 border-t border-gray-200 bg-white">
        {isEnrolled ? (
          <TouchableOpacity
            onPress={() => router.push(`/learning/${course._id}`)}
            className="bg-[#55BAD3] p-4 rounded-lg items-center"
          >
            <Text className="text-white text-lg font-bold">Bắt đầu học</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                ${course.price}
              </Text>
              {course.originalPrice && (
                <Text className="text-sm text-gray-400 line-through">
                  ${course.originalPrice}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleAddToCart}
              className="bg-[#55BAD3] rounded-lg p-4 flex-row items-center"
            >
              <Ionicons name="cart-outline" size={22} color="white" />
              <Text className="text-white text-md font-semibold ml-2">
                Add to cart
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CourseDetailScreen;
