import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import api from "../../api/api";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface Project {
  _id: string;
  user: { name: string };
  description: string;
  createdAt: string;
}

const ProjectsTab = ({ courseId }: { courseId: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/projects/${courseId}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [courseId]);

  const handleUploadProject = () => {
    // Tạm thời chỉ hiển thị thông báo
    Toast.show({
      type: "info",
      text1: "Upload Feature Coming Soon",
      text2: "This feature is under development.",
    });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={projects}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center mb-2">
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${item.user.name}&background=random`,
                }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View>
                <Text className="font-bold text-lg">{item.user.name}</Text>
                <Text className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-700">{item.description}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View className="p-4">
            <TouchableOpacity
              onPress={handleUploadProject}
              className="border-2 border-dashed border-[#55BAD3] rounded-lg p-8 items-center justify-center bg-[#EEFCFF]"
            >
              <Ionicons name="cloud-upload-outline" size={40} color="#55BAD3" />
              <Text className="text-[#55BAD3] font-semibold mt-2">
                Upload your project here
              </Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold mt-6">
              {projects.length} Student Projects
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-5">
            No projects have been submitted yet.
          </Text>
        }
      />
    </View>
  );
};

export default ProjectsTab;
