# 🚀 Hướng Dẫn Deploy Backend lên Vercel

## Bước 1: Cài đặt Vercel CLI

Mở PowerShell/Terminal và chạy:

```powershell
npm install -g vercel
```

Hoặc nếu dùng yarn:

```powershell
yarn global add vercel
```

## Bước 2: Login vào Vercel

```powershell
vercel login
```

Sẽ mở browser để đăng nhập. Có thể dùng:

- GitHub account
- GitLab account
- Email

## Bước 3: Setup MongoDB Atlas (nếu chưa có)

### 3.1 Tạo tài khoản MongoDB Atlas

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký miễn phí (Free Tier - M0)
3. Tạo cluster mới:
   - Cloud Provider: AWS
   - Region: Singapore (ap-southeast-1) - gần Việt Nam nhất
   - Cluster Tier: M0 Sandbox (FREE)

### 3.2 Tạo Database User

1. Vào **Database Access**
2. Click **Add New Database User**
3. Authentication Method: Password
4. Username: `admin` (hoặc tên bạn muốn)
5. Password: Click **Autogenerate Secure Password** (lưu lại password này!)
6. Database User Privileges: **Atlas admin**
7. Click **Add User**

### 3.3 Whitelist IP Address

1. Vào **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

⚠️ **Lưu ý**: Trong production thực tế, nên whitelist IP cụ thể. Cho đồ án demo thì allow all OK.

### 3.4 Lấy Connection String

1. Vào **Database** → **Connect**
2. Chọn **Connect your application**
3. Driver: **Node.js**, Version: **6.7 or later**
4. Copy connection string, format:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Thay thế:
   - `<username>` → username bạn đã tạo
   - `<password>` → password đã lưu
   - Thêm tên database: `/elearning` sau `.net`

Kết quả:

```
mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/elearning?retryWrites=true&w=majority
```

## Bước 4: Deploy lên Vercel

### 4.1 Deploy lần đầu

Ở thư mục `e-learning-backend`:

```powershell
vercel
```

Trả lời các câu hỏi:

```
? Set up and deploy "e-learning-backend"? [Y/n] y
? Which scope do you want to deploy to? → Chọn account của bạn
? Link to existing project? [y/N] n
? What's your project's name? → e-learning-backend (hoặc để mặc định)
? In which directory is your code located? → ./ (nhấn Enter)
```

Vercel sẽ:

1. Upload code
2. Build project
3. Deploy lên URL preview (dạng: https://e-learning-backend-xxx.vercel.app)

### 4.2 Thêm Environment Variables

Sau khi deploy thành công, cần thêm biến môi trường:

**Cách 1: Qua Dashboard (RECOMMENDED)**

1. Truy cập: https://vercel.com/dashboard
2. Chọn project `e-learning-backend`
3. Vào tab **Settings** → **Environment Variables**
4. Thêm các biến sau (click **Add** cho mỗi biến):

```
Name: MONGODB_URI
Value: mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/elearning?retryWrites=true&w=majority
Environment: Production, Preview, Development (chọn cả 3)

Name: JWT_SECRET
Value: super-secret-jwt-key-for-production-change-this-123456
Environment: Production, Preview, Development

Name: NODE_ENV
Value: production
Environment: Production
```

**Cách 2: Qua CLI**

```powershell
vercel env add MONGODB_URI production
# Paste MongoDB connection string khi được hỏi

vercel env add JWT_SECRET production
# Nhập JWT secret key

vercel env add NODE_ENV production
# Nhập: production
```

### 4.3 Redeploy với Environment Variables

Sau khi thêm env variables, deploy lại:

```powershell
vercel --prod
```

Lệnh này sẽ deploy lên production URL (domain chính).

## Bước 5: Verify Deployment

### 5.1 Kiểm tra URL

Sau khi deploy xong, Vercel sẽ hiển thị URL:

```
✅ Production: https://e-learning-backend.vercel.app
```

### 5.2 Test API Endpoints

**Test 1: Health Check**

```powershell
curl https://your-project.vercel.app/api/health
```

Hoặc mở browser: `https://your-project.vercel.app/api/health`

**Test 2: Get Courses**

```powershell
curl https://your-project.vercel.app/api/courses
```

**Test 3: Login**

```powershell
curl -X POST https://your-project.vercel.app/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"student@test.com","password":"123456"}'
```

### 5.3 Check Logs

Nếu có lỗi, xem logs:

```powershell
vercel logs
```

Hoặc trên Dashboard: **Deployments** → Click vào deployment → **Logs**

## Bước 6: Seed Database (Optional)

Nếu database trống, cần seed data:

### Option 1: Chạy seed script local kết nối production DB

1. Copy `.env.example` → `.env`
2. Paste MongoDB production URI vào `.env`
3. Chạy:

```powershell
node seed.js
```

### Option 2: Import data trực tiếp vào MongoDB Atlas

1. Export data từ local MongoDB
2. Import vào MongoDB Atlas qua MongoDB Compass

## Bước 7: Update URL trong Frontend

Sau khi backend deploy xong, cập nhật API URL trong frontend:

File: `e-learning-frontend/api/api.ts`

```typescript
const API_URL = "https://your-backend.vercel.app/api";
```

---

## 📝 Troubleshooting

### Lỗi 1: "Error: MongoDB connection failed"

**Giải pháp:**

- Kiểm tra MONGODB_URI đúng format
- Kiểm tra password có ký tự đặc biệt → encode URL
- Kiểm tra Network Access whitelist 0.0.0.0/0

### Lỗi 2: "500 Internal Server Error"

**Giải pháp:**

- Xem logs: `vercel logs`
- Kiểm tra env variables đã set chưa
- Kiểm tra code có lỗi syntax không

### Lỗi 3: "Cannot find module"

**Giải pháp:**

- Chắc chắn `package.json` có đầy đủ dependencies
- Run `npm install` trước khi deploy
- Xóa `node_modules` và `.vercel`, deploy lại

### Lỗi 4: CORS Error từ Mobile App

**Giải pháp:**

- Thêm CORS config trong `app.js`:

```javascript
app.use(
  cors({
    origin: "*", // Cho phép tất cả origins (cho demo)
    credentials: true,
  })
);
```

---

## 🎯 Checklist Deploy Thành Công

- [ ] Vercel CLI installed
- [ ] Logged in to Vercel
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Deployed to Vercel
- [ ] Environment variables added
- [ ] Redeployed with env vars
- [ ] API endpoints tested
- [ ] Database seeded (if needed)
- [ ] Frontend updated with API URL
- [ ] Demo works end-to-end

---

## 📌 Useful Commands

```powershell
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs

# List deployments
vercel ls

# Remove project
vercel rm e-learning-backend

# Add domain
vercel domains add yourdomain.com

# View env variables
vercel env ls
```

---

## 🌐 URLs sau khi Deploy

- **Production**: https://e-learning-backend.vercel.app
- **Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com

Lưu các URL này vào tài liệu đồ án!

---

## 💡 Tips

1. **Giữ MongoDB URI an toàn**: Không commit vào Git
2. **Test trước khi deploy**: Run `npm start` local
3. **Monitor usage**: Check Vercel dashboard để không vượt free tier
4. **Backup database**: Export MongoDB data thường xuyên
5. **Documentation**: Screenshot các bước setup để nộp báo cáo

---

**Thời gian ước tính:** 30-45 phút cho lần đầu deploy

**Next Step:** Sau khi backend deploy xong → Deploy mobile app (build APK)
