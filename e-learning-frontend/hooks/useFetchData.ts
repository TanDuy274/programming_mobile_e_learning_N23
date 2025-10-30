import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import Toast from "react-native-toast-message";

export const useFetchData = (endpoints: string[]) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const responses = await Promise.all(
        endpoints.map((endpoint) => api.get(endpoint))
      );
      const extractedData = responses.map((res) => res.data);
      setData(extractedData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải dữ liệu.",
      });
      console.error("Fetch data error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isRefreshing, onRefresh };
};
