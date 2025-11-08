import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/api";
import Toast from "react-native-toast-message";

export const useFetchData = (endpoints: string[]) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stabilize endpoints reference to prevent unnecessary re-fetches
  const endpointsKey = useMemo(() => JSON.stringify(endpoints), [endpoints]);

  const fetchData = useCallback(async () => {
    try {
      const endpointsList = JSON.parse(endpointsKey);
      const responses = await Promise.all(
        endpointsList.map((endpoint: string) => api.get(endpoint))
      );
      const extractedData = responses.map((res) => res.data);
      setData(extractedData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải dữ liệu.",
      });
      if (__DEV__) {
        console.error("Fetch data error:", error);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [endpointsKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isRefreshing, onRefresh };
};
