# programming_mobile_e_learning_N23

# Ứng dụng E-Learning (Nhóm 23)

Một dự án xây dựng nền tảng học trực tuyến, bao gồm một ứng dụng di động cho học viên và một trang quản trị đơn giản cho admin.

## Mục lục

- [Mô tả](#mô-tả)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Chạy dự án](#chạy-dự-án)
- [Các API Endpoint chính](#các-api-endpoint-chính)
- [Trang Quản trị (Admin)](#trang-quản-trị-admin)

---

## Mô tả

Dự án này là một nền tảng học tập trực tuyến, cho phép người dùng đăng ký, đăng nhập, tham gia các khóa học và để lại đánh giá. Phía quản trị viên có một trang web riêng để quản lý toàn bộ dữ liệu của ứng dụng như người dùng, khóa học, và danh mục.

---

## Tính năng chính

### 📱 Ứng dụng Di động (React Native)

- **Xác thực người dùng**: Đăng ký, đăng nhập an toàn bằng JWT.
- **Trang chủ**: Hiển thị các khóa học nổi bật, danh mục.
- **Xem khóa học**: Lướt xem danh sách các khóa học.
- **Ghi danh**: Người dùng có thể ghi danh vào các khóa học.
- **Đánh giá**: Để lại bình luận và xếp hạng sao cho khóa học đã tham gia.
- **Quản lý cá nhân**: Xem thông tin cá nhân và đăng xuất.

### 🌐 Trang Quản trị (EJS & Express)

- **CRUD đầy đủ**: Thêm, Sửa, Xóa, Xem cho tất cả các mục.
- **Quản lý Người dùng**: Xem danh sách, tạo, sửa, xóa người dùng và phân quyền (student/teacher).
- **Quản lý Khóa học**: Quản lý thông tin chi tiết của các khóa học.
- **Quản lý Danh mục**: Dễ dàng thêm, sửa, xóa các danh mục.
- **Quản lý Ghi danh & Đánh giá**: Theo dõi và quản lý các lượt ghi danh và đánh giá của người dùng.

---

## Công nghệ sử dụng

### Backend

- **Node.js**: Môi trường chạy JavaScript phía server.
- **Express.js**: Framework xây dựng API.
- **MongoDB**: Cơ sở dữ liệu NoSQL để lưu trữ dữ liệu.
- **Mongoose**: Thư viện làm việc với MongoDB.
- **JWT (JSON Web Tokens)**: Để xác thực người dùng.
- **EJS (Embedded JavaScript)**: Dùng để xây dựng trang Admin.

### Frontend

- **React Native (Expo)**: Framework xây dựng ứng dụng di động đa nền tảng.
- **TypeScript**: Ngôn ngữ giúp code an toàn và dễ bảo trì hơn.
- **Tailwind CSS (NativeWind)**: Dùng để tạo kiểu giao diện nhanh chóng.
- **React Navigation**: Quản lý luồng di chuyển giữa các màn hình.
- **Axios**: Gửi yêu cầu HTTP đến backend.
- **Expo Secure Store**: Lưu trữ token đăng nhập một cách an toàn.

---

## Hướng dẫn cài đặt

Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau.

### Yêu cầu

- [Node.js](https://nodejs.org/) (khuyên dùng phiên bản v20 LTS)
- [MongoDB](https://www.mongodb.com/try/download/community) phải được cài đặt và đang chạy.
- [Expo Go](https://expo.dev/go) trên điện thoại của bạn.
- [Genymotion](https://www.genymotion.com) trên máy tính của bạn.

### Cài đặt Backend

1.  **Clone repository:**
    ```bash
    git clone https://github.com/TanDuy274/programming_mobile_e_learning_N23.git
    ```
2.  **Đi đến thư mục backend:**
    ```bash
    cd e-learning-backend
    ```
3.  **Tạo file `.env`** ở thư mục gốc và cấu hình các biến môi trường:
    ```env
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/elearningapp
    JWT_SECRET=daylamotchuoibimatcualun123456
    ```
4.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

### Cài đặt Frontend

1.  **Đi đến thư mục frontend:**
    ```bash
    cd e-learning-frontend
    ```
2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```
3.  **Tạo file `.env`** trong thư mục gốc và cấu hình địa chỉ IP của máy:
    ```env
    EXPO_PUBLIC_API_URL=http://diachiIPcuamay:5001/api
    ```

---

## Chạy dự án

Bạn cần mở **2 cửa sổ terminal** riêng biệt để chạy song song cả backend và frontend.

1.  **Chạy Backend Server:**

    ```bash
    # Trong thư mục e-learning-backend
    npm run start
    ```

    Server sẽ chạy tại `http://localhost:5001`.

2.  **Chạy Frontend App:**

    ```bash
    # Trong thư mục e-learning-frontend
    npx expo start
    ```

    hoặc

    ```bash
    # Trong thư mục e-learning-frontend
    npm run start
    ```

    Quét mã QR bằng ứng dụng Expo Go trên điện thoại của bạn hoặc có thể chạy trên Genymotion.

---

## Các API Endpoint chính

- `POST /api/auth/register`: Đăng ký người dùng mới.
- `POST /api/auth/login`: Đăng nhập và nhận token.
- `GET /api/courses`: Lấy danh sách tất cả khóa học.
- `GET /api/categories`: Lấy danh sách các danh mục.
- `POST /api/enrollments/:courseId`: Ghi danh vào một khóa học (cần token).

---

## Trang Quản trị (Admin)

Sau khi backend đã chạy, bạn có thể truy cập trang quản trị tại:

**`http://localhost:5001/admin`**

Từ đây, bạn có thể quản lý toàn bộ dữ liệu của ứng dụng.
