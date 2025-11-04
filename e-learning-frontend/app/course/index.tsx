import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import api from "@/api/api";
import Header from "@/components/Header";

interface Instructor {
  name: string;
  avatar?: string;
}
interface Category {
  name: string;
}
interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviewCount: number;
  instructor: Instructor;
  category: Category;
  totalDurationMinutes?: number;
}

type ParamStr = string | string[] | undefined;
function asStr(v: ParamStr): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

const FilterBar = React.memo(
  ({
    sort,
    featuredOnly,
    onChangeSort,
    onToggleFeatured,
    clearFilters,
  }: any) => {
    return (
      <View className="flex-row flex-wrap mb-4 gap-2 mt-4 px-4">
        {/* Nút sắp xếp */}
        <TouchableOpacity
          onPress={() => {
            const nextSort =
              sort === "newest"
                ? "popular"
                : sort === "popular"
                  ? "priceAsc"
                  : sort === "priceAsc"
                    ? "priceDesc"
                    : "newest";
            onChangeSort(nextSort);
            // fetchPage(1);
          }}
          className="flex-row items-center px-3 py-1.5 border border-gray-300 rounded-full bg-gray-50"
        >
          <Ionicons name="swap-vertical-outline" size={16} color="#555" />
          <Text className="ml-1 text-gray-700 text-sm">
            {sort === "newest"
              ? "Newest"
              : sort === "popular"
                ? "Popular"
                : sort === "priceAsc"
                  ? "Price: Low to High"
                  : "Price: High to Low"}
          </Text>
        </TouchableOpacity>

        {/* Nút Featured */}
        <TouchableOpacity
          onPress={onToggleFeatured}
          className={`flex-row items-center px-3 py-1.5 rounded-full border ${
            featuredOnly
              ? "bg-[#55BAD3] border-[#55BAD3]"
              : "bg-gray-50 border-gray-300"
          }`}
        >
          <Ionicons
            name="star-outline"
            size={16}
            color={featuredOnly ? "white" : "#555"}
          />
          <Text
            className={`ml-1 text-sm ${
              featuredOnly ? "text-white font-semibold" : "text-gray-700"
            }`}
          >
            Featured
          </Text>
        </TouchableOpacity>

        {/* Nút clear */}
        {(featuredOnly || sort !== "newest") && (
          <TouchableOpacity
            onPress={clearFilters}
            className="flex-row items-center px-3 py-1.5 border border-gray-300 rounded-full bg-gray-50"
          >
            <Ionicons name="close-circle-outline" size={16} color="#555" />
            <Text className="ml-1 text-gray-700 text-sm">Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const CoursesScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const sortParamDefault =
    (asStr(params.sort) as "popular" | "priceAsc" | "priceDesc" | "newest") ||
    "newest";

  const [sort, setSort] = useState(sortParamDefault);
  const [featuredOnly, setFeaturedOnly] = useState(
    asStr(params.featured) === "1"
  );

  const categoryId = asStr(params.categoryId);
  const categoryName = asStr(params.categoryName);
  const qParam = asStr(params.q);

  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  // tiêu đề
  const title = useMemo(() => {
    if (categoryName) return `Course: ${categoryName}`;
    if (featuredOnly) return "Featured Courses";
    switch (sort) {
      case "popular":
        return "Popular Courses";
      case "priceAsc":
        return "Price: Low to High";
      case "priceDesc":
        return "Price: High to Low";
      case "newest":
      default:
        return "All Courses";
    }
  }, [categoryName, featuredOnly, sort]);

  // gọi API
  const fetchPage = useCallback(
    async (pageNum: number) => {
      try {
        const res = await api.get("/courses", {
          params: {
            page: pageNum,
            limit: 10,
            sort,
            featured: featuredOnly ? "1" : undefined,
            categoryId,
            q: qParam,
          },
        });

        const docs: Course[] = Array.isArray(res.data?.docs)
          ? res.data.docs
          : Array.isArray(res.data)
            ? res.data
            : [];

        if (pageNum === 1) setCourses(docs);
        else setCourses((prev) => [...prev, ...docs]);

        setHasNext(!!res.data?.hasNextPage);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [sort, featuredOnly, categoryId, qParam]
  );

  useEffect(() => {
    // setIsLoading(true);
    // setIsRefreshing(true);
    setPage(1);
    fetchPage(1);
  }, [fetchPage]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    fetchPage(1);
  };

  const loadMore = () => {
    if (hasNext && !isLoading) {
      const next = page + 1;
      setPage(next);
      fetchPage(next);
    }
  };

  const clearFilters = useCallback(() => {
    setSort("newest");
    setFeaturedOnly(false);
    // fetchPage(1);
  }, []);

  const onChangeSort = useCallback((newSortValue: string) => {
    // <-- Sửa lại để nhận giá trị
    setSort(newSortValue as any); // (cast 'as any' nếu cần)
  }, []);

  const onToggleFeatured = useCallback(() => {
    setFeaturedOnly((prev) => !prev);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <TouchableOpacity
        onPress={() => router.push(`/course/${item._id}`)}
        className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-200 overflow-hidden"
      >
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-500 text-sm">
            {item.instructor?.name} • {item.category?.name}
          </Text>

          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={16} color="#f1c40f" />
            <Text className="ml-1 text-sm text-gray-700">
              {Number(item.rating || 0).toFixed(1)} ({item.reviewCount || 0})
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-[#55BAD3] font-bold text-lg">
              ${Number(item.price || 0).toFixed(2)}
            </Text>
            {item.totalDurationMinutes ? (
              <Text className="text-gray-500 text-sm">
                ⏱ {item.totalDurationMinutes} minutes
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  if (isLoading && page === 1) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#55BAD3" />
        <Text className="mt-3 text-gray-500">Loading courses...</Text>
      </SafeAreaView>
    );
  }

  // giao diện
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header title={title} showBackButton />

      {/* Nhóm nút lọc đơn giản */}

      <FilterBar
        sort={sort}
        featuredOnly={featuredOnly}
        onChangeSort={onChangeSort}
        onToggleFeatured={onToggleFeatured}
        clearFilters={clearFilters}
      />

      {/* Danh sách */}
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        className="px-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#55BAD3"]}
          />
        }
        ListEmptyComponent={
          <View className="py-16 items-center">
            <Ionicons name="library-outline" size={36} />
            <Text className="mt-2 text-gray-500">
              No matching courses found
            </Text>
          </View>
        }
        ListFooterComponent={
          hasNext ? (
            <ActivityIndicator size="small" color="#55BAD3" className="my-4" />
          ) : courses.length > 0 ? (
            <View className="py-4">
              <Text className="text-center text-gray-400">No more courses</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default CoursesScreen;
