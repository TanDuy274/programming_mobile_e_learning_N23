import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CourseData, Lesson } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "@/api/api";
import ProjectsTab from "@/components/learning/ProjectsTab";
import QandATab from "@/components/learning/QandATab";
import LessonsTab from "@/components/learning/LessonsTab";

const LearningScreen = () => {
  const layout = useWindowDimensions();
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "lessons", title: "Lessons" },
    { key: "projects", title: "Projects" },
    { key: "qa", title: "Q&A" },
  ]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
        if (response.data.lessons?.length > 0) {
          setSelectedLesson(response.data.lessons[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const renderScene = SceneMap({
    lessons: () => (
      <ScrollView>
        <LessonsTab
          lessons={course?.lessons || []}
          selectedLessonId={selectedLesson?._id || ""}
          onSelectLesson={handleSelectLesson}
        />
      </ScrollView>
    ),
    projects: () => <ProjectsTab courseId={courseId} />,
    qa: () => <QandATab courseId={courseId} />,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="items-center pt-1 pb-3">
        <View className="w-8" />
        <Text className="text-xl font-bold text-gray-800">Learning</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 bg-white/70 p-2 rounded-full z-10"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* --- Video Player --- */}
        <View
          className="bg-black"
          style={{ width: "100%", aspectRatio: 16 / 9 }}
        >
          {selectedLesson?.youtubeVideoId && (
            <YoutubePlayer
              height={300}
              play={true}
              videoId={selectedLesson.youtubeVideoId}
            />
          )}
        </View>

        {/* --- Tiêu đề --- */}
        <View className="p-5">
          <Text className="text-2xl font-bold text-gray-900">
            {course?.title}
          </Text>
        </View>

        {/* --- Tabs --- */}
        <View className="flex-1">
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...(props as any)}
                indicatorStyle={{ backgroundColor: "#55BAD3" }}
                style={{
                  backgroundColor: "white",
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E5E7EB",
                  marginHorizontal: 16,
                }}
                activeColor="#55BAD3"
                inactiveColor="black"
                renderLabel={({
                  route,
                  color,
                }: {
                  route: { title: string };
                  color: string;
                }) => (
                  <Text style={{ color, fontWeight: "bold" }}>
                    {route.title}
                  </Text>
                )}
              />
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LearningScreen;
