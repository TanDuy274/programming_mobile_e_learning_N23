import { Lesson } from "@/types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  lessons: Lesson[];
  selectedLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
};

const LessonsTab = ({ lessons, selectedLessonId, onSelectLesson }: Props) => {
  // Trong tương lai, có thể nhóm các bài học theo section
  // const groupedLessons = groupLessonsBySection(lessons);

  return (
    <View className="p-4">
      {lessons.map((lesson, index) => {
        const isSelected = selectedLessonId === lesson._id;
        return (
          <TouchableOpacity
            key={lesson._id}
            onPress={() => onSelectLesson(lesson)}
            className={`flex-row items-center p-4 mb-2 rounded-lg border ${
              isSelected
                ? "bg-[#EEFCFF] border-[#55BAD3]"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Text
              className={`font-bold mr-4 ${isSelected ? "text-[#55BAD3]" : "text-gray-500"}`}
            >
              {String(index + 1).padStart(2, "0")}
            </Text>
            <View className="flex-1">
              <Text
                className={`font-semibold text-base ${isSelected ? "text-[#55BAD3]" : "text-gray-800"}`}
              >
                {lesson.title}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {lesson.duration} mins
              </Text>
            </View>
            <Ionicons
              name={isSelected ? "play-circle" : "play-circle-outline"}
              size={28}
              color={isSelected ? "#55BAD3" : "gray"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LessonsTab;
