import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "@/api/api";

interface Teacher {
  _id: string;
  name: string;
  avatar?: string;
  headline?: string;
  courseCount?: number;
}

const TeacherScreen = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch list of teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const res = await api.get("/users/teachers", {
        params: { role: "teacher" },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.docs)
          ? res.data.docs
          : [];
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchTeachers();
  };

  const renderItem = ({ item }: { item: Teacher }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/teacher/[teacherId]",
          params: { teacherId: item._id },
        })
      }
      className="flex-row bg-white rounded-2xl mb-4 shadow-sm border border-gray-200 p-3 items-center"
    >
      <Image
        source={{
          uri:
            item.avatar ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        className="w-16 h-16 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        {item.headline ? (
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {item.headline}
          </Text>
        ) : null}
        <View className="flex-row items-center mt-2">
          <Ionicons name="school-outline" size={16} color="#55BAD3" />
          <Text className="ml-1 text-sm text-[#55BAD3]">
            {item.courseCount ? `${item.courseCount} courses` : "View details"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#55BAD3" />
        <Text className="mt-3 text-gray-500">Loading teachers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Text className="text-2xl font-bold mt-6 mb-4">Teacher List</Text>

      <FlatList
        data={teachers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#55BAD3"]}
          />
        }
        ListEmptyComponent={
          <View className="py-16 items-center">
            <Ionicons name="people-outline" size={36} color="#999" />
            <Text className="mt-2 text-gray-500">No teachers found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TeacherScreen;
