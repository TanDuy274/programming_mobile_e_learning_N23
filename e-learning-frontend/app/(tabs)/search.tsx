import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import api from "@/api/api";
import { Lesson } from "@/types";
import CourseCard from "@/components/CourseCard";
import CategoryListItem from "@/components/CategoryListItem";
import EmptyState from "@/components/EmptyState";

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
interface Category {
  _id: string;
  name: string;
}

const HOT_TOPICS = [
  "Java",
  "SQL",
  "Javascript",
  "Python",
  "Digital marketing",
  "Photoshop",
];

const categoryDetails: {
  [key: string]: { icon: keyof typeof Ionicons.glyphMap; color: string };
} = {
  Business: { icon: "briefcase-outline", color: "#3498db" },
  Code: { icon: "code-slash-outline", color: "#e74c3c" },
  Design: { icon: "color-palette-outline", color: "#9b59b6" },
  Writing: { icon: "create-outline", color: "#34495e" },
  Movie: { icon: "film-outline", color: "#f1c40f" },
  Language: { icon: "language-outline", color: "#2ecc71" },
};

const SearchScreen = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const fetchInitial = useCallback(async () => {
    try {
      const [catRes, recRes] = await Promise.all([
        api.get("/categories?limit=6"),
        api.get("/courses", { params: { sort: "recommended", limit: 5 } }),
      ]);
      setCategories(
        Array.isArray(catRes.data) ? catRes.data : (catRes.data?.docs ?? [])
      );
      setRecommended(
        Array.isArray(recRes.data?.docs)
          ? recRes.data.docs
          : (recRes.data ?? [])
      );
    } catch (err) {
      console.error("Fetch initial data failed:", err);
    }
  }, []);

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await fetchInitial();
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchInitial]);

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const res = await api.get("/courses/search", {
        params: { keyword: query },
      });
      setSearchResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search 500ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim().length > 1) handleSearch(searchQuery);
      else setSearchResults([]);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, handleSearch]);

  // Pull-to-refresh chung (tùy theo trạng thái)
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (searchQuery.trim().length > 1) {
        await handleSearch(searchQuery);
      } else {
        await fetchInitial();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [searchQuery, handleSearch, fetchInitial]);

  // Render Category item
  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryListItem
        key={item._id}
        categoryName={item.name}
        iconName={categoryDetails[item.name]?.icon || "help-circle-outline"}
        color={categoryDetails[item.name]?.color || "#bdc3c7"}
        onPress={() =>
          router.push({
            pathname: "/course",
            params: { categoryId: item._id, categoryName: item.name },
          })
        }
      />
    ),
    [router]
  );

  // Render Course item
  const renderCourseItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard
        layout="vertical"
        id={item._id}
        title={item.title}
        instructor={item.instructor?.name}
        price={item.price}
        rating={item.rating}
        reviews={item.reviewCount}
        imageUrl={item.thumbnail}
        lessonsCount={item.lessons.length}
      />
    ),
    []
  );

  // View khởi tạo (chưa tìm kiếm)
  const renderInitialView = useMemo(
    () => (
      <FlatList
        className="flex-1"
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#55BAD3"]}
          />
        }
        ListHeaderComponent={
          <>
            {/* Hot Topics */}
            <View className="p-5">
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Hot topics
              </Text>
              <View className="flex-row flex-wrap">
                {HOT_TOPICS.map((topic) => (
                  <TouchableOpacity
                    key={topic}
                    className="bg-white rounded-full px-4 py-2 mr-2 mb-2 border border-[#55BAD3]"
                    onPress={() => setSearchQuery(topic)}
                  >
                    <Text className="text-[#55BAD3]">{topic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View className="p-5 pt-0 flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">
                Categories
              </Text>
              <TouchableOpacity onPress={() => router.push("/categories")}>
                <Text className="text-[#55BAD3]">View more</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            {/* Recommended */}
            <View className="p-5 pt-0">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-gray-800">
                  Recommended for you
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/course",
                      params: { sort: "recommended" },
                    })
                  }
                >
                  <Text className="text-[#55BAD3]">View more</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={recommended}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <CourseCard
                    id={item._id}
                    title={item.title}
                    instructor={item.instructor?.name}
                    price={item.price}
                    rating={item.rating}
                    reviews={item.reviewCount}
                    imageUrl={item.thumbnail}
                    lessonsCount={item.lessons.length}
                  />
                )}
                initialNumToRender={4}
                windowSize={3}
                removeClippedSubviews
              />
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    ),
    [
      categories,
      recommended,
      renderCategoryItem,
      isRefreshing,
      onRefresh,
      router,
    ]
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      {/* Search Bar */}
      <View className="p-5 flex-row items-center gap-x-3 border-b border-gray-200">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg p-3">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search course"
            className="flex-1 ml-3 text-[16px] py-1"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <Ionicons name="close-circle" size={22} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity className="bg-[#55BAD3] p-3 rounded-lg">
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Nội dung chính */}
      {searchQuery.trim().length > 1 ? (
        isSearching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator
              size="large"
              color="#4F46E5"
              style={{ marginTop: 80 }}
            />
          </View>
        ) : (
          <FlatList
            className="flex-1"
            data={searchResults}
            keyExtractor={(item) => item._id}
            renderItem={renderCourseItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={["#55BAD3"]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="search-circle-outline"
                message={`Không tìm thấy kết quả cho "${searchQuery}"`}
              />
            }
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
              justifyContent:
                searchResults.length === 0 ? "center" : "flex-start",
            }}
            initialNumToRender={5}
            windowSize={5}
            removeClippedSubviews
          />
        )
      ) : (
        renderInitialView
      )}
    </SafeAreaView>
  );
};

export default React.memo(SearchScreen);
