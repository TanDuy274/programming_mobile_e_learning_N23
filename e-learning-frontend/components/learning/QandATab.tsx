import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Toast from "react-native-toast-message";

interface Question {
  _id: string;
  user: { name: string };
  text: string;
  createdAt: string;
}

const QandATab = ({ courseId }: { courseId: string }) => {
  const { userInfo } = useContext(AuthContext);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/questions/${courseId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId]);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await api.post("/questions", {
        courseId,
        text: newQuestion,
      });
      setQuestions([response.data, ...questions]);
      setNewQuestion("");
      Toast.show({ type: "success", text1: "Đã gửi câu hỏi của bạn!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Không thể gửi câu hỏi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    // DÙNG KeyboardAvoidingView LÀM GỐC
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Thêm offset cho iOS
    >
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center mb-2">
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${item.user.name}&background=random`,
                }}
                className="w-8 h-8 rounded-full mr-3"
              />
              <View>
                <Text className="font-bold">{item.user.name}</Text>
                <Text className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-700">{item.text}</Text>
          </View>
        )}
        ListHeaderComponent={
          <Text className="p-4 text-lg font-bold">Q&A Community</Text>
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No questions have been asked yet. Be the first to ask!
          </Text>
        }
        // Thêm một khoảng trống ở cuối để không bị che
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View className="p-4 border-t border-gray-200 bg-white">
        <TextInput
          value={newQuestion}
          onChangeText={setNewQuestion}
          placeholder={`Hỏi với tư cách ${userInfo?.name}...`}
          className="bg-gray-100 rounded-lg p-3 text-base"
          multiline
        />
        <TouchableOpacity
          onPress={handleSubmitQuestion}
          disabled={isSubmitting}
          className="bg-[#55BAD3] p-4 rounded-lg items-center mt-3"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Send question</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default QandATab;
