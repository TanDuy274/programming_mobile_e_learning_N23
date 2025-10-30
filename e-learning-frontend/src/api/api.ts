import axios from "axios";
import * as SecureStore from "expo-secure-store";

// LƯU Ý QUAN TRỌNG:
// Dùng địa chỉ IP của máy tính bạn, KHÔNG DÙNG 'localhost'.
<<<<<<<<< Temporary merge branch 1
const BASE_URL = "http://192.168.1.82:5001/api"; // << THAY ĐỔI ĐỊA CHỈ IP NÀY
=========
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // << THAY ĐỔI ĐỊA CHỈ IP NÀY
>>>>>>>>> Temporary merge branch 2

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
