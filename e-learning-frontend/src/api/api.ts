import axios from "axios";
import * as SecureStore from "expo-secure-store";

// LƯU Ý QUAN TRỌNG:
// Dùng địa chỉ IP của máy tính bạn, KHÔNG DÙNG 'localhost'.
const BASE_URL = "http://192.168.56.1:5001/api"; // << THAY ĐỔI ĐỊA CHỈ IP NÀY

const api = axios.create({
  baseURL: BASE_URL,
});

// Tự động thêm token vào header cho mỗi yêu cầu
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
