import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import api from "@/api/api";
import Header from "@/components/Header";

interface Category {
  _id: string;
  name: string;
  thumbnail?: string;
  courseCount?: number;
  description?: string;
}

const CategoryScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.docs)
          ? res.data.docs
          : [];
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCategories();
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/course",
          params: { categoryId: item._id, categoryName: item.name },
        })
      }
      className="flex-row bg-white rounded-2xl mb-4 shadow-sm border border-gray-200 overflow-hidden"
    >
      {item.thumbnail ? (
        <Image
          source={{ uri: item.thumbnail }}
          className="w-28 h-28"
          resizeMode="cover"
        />
      ) : (
        <View className="w-28 h-28 items-center justify-center bg-gray-100">
          <Ionicons name="folder-outline" size={32} color="#55BAD3" />
        </View>
      )}

      <View className="flex-1 p-3 justify-center">
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        {item.description ? (
          <Text
            className="text-gray-500 text-sm mt-1"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        ) : null}
        <Text className="text-[#55BAD3] mt-2 text-sm font-medium">
          {item.courseCount ? `${item.courseCount} courses` : "View courses"}
        </Text>
      </View>

      <View className="items-center justify-center pr-3">
        <Ionicons name="chevron-forward" size={22} color="#999" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#55BAD3" />
        <Text className="mt-3 text-gray-500">Loading categories...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Course Categories" showBackButton />

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="mt-4 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#55BAD3"]}
          />
        }
        ListEmptyComponent={
          <View className="py-16 items-center">
            <Ionicons name="albums-outline" size={36} color="#999" />
            <Text className="mt-2 text-gray-500">No categories found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CategoryScreen;
