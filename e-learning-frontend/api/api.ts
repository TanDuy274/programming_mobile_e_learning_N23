import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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

api.interceptors.response.use(
  (response) => {
    // Nếu request thành công, chỉ cần trả về response
    return response;
  },
  async (error) => {
    // Nếu request thất bại, kiểm tra xem có phải lỗi 401 không
    if (error.response && error.response.status === 401) {
      // Lỗi 401: Token không hợp lệ hoặc đã hết hạn
      console.log("Token expired or invalid. Logging out...");

      // Xóa token đã lưu
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userInfo");
    }

    // Ném lỗi ra để các hàm gọi API khác có thể bắt và xử lý
    return Promise.reject(error);
  }
);

export default api;
