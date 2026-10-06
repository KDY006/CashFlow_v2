# Hướng dẫn Deploy CashFlow lên Vercel & Chạy Local

Dự án đã được chuyển đổi hoàn toàn (100% Full Project) từ kiến trúc PHP 3 lớp sang **React 18 (JSX) + Vite**, tương thích hoàn toàn để deploy lên **Vercel** với cấu hình chuẩn `vercel.json`.

---

## 1. Cấu trúc Dự án React / JSX mới

```
CashFlow/
├── public/                     # Ảnh logo, avatar
│   ├── logo.png
│   └── avatars/
├── src/
│   ├── components/            # Components tái sử dụng
│   │   ├── Navbar.jsx         # Header desktop & User dropdown
│   │   ├── MobileNav.jsx      # Bottom Navigation di động + Nút FAB (+)
│   │   ├── GlobalAddModal.jsx # Modal thêm giao dịch (Thủ công + AI Phân tích)
│   │   └── ToastContainer.jsx # Thông báo Toast giao diện chuẩn
│   ├── context/
│   │   ├── AuthContext.jsx    # Quản lý đăng nhập, hồ sơ, bảo mật
│   │   └── DataContext.jsx    # Quản lý giao dịch, ngân sách, danh mục, lịch
│   ├── data/
│   │   └── seedData.js        # 100% dữ liệu gốc trích xuất từ cashflow_db.sql
│   ├── pages/
│   │   ├── Dashboard.jsx      # Tổng quan thu chi, biểu đồ Chart.js
│   │   ├── Transactions.jsx   # Sổ giao dịch, tìm kiếm, lọc cha/con
│   │   ├── Budgets.jsx        # Lập hũ ngân sách & Quản lý danh mục
│   │   ├── Calendar.jsx       # Lịch tháng, ghi chú ngày (Sticky note)
│   │   ├── AIAdvisor.jsx      # Chatbot cố vấn tài chính AI thông minh
│   │   ├── Profile.jsx        # Hồ sơ cá nhân & Đổi mật khẩu
│   │   ├── Login.jsx          # Đăng nhập (Giao diện Dark/Emerald cao cấp)
│   │   ├── Register.jsx       # Đăng ký tài khoản
│   │   ├── ForgotPassword.jsx # Quên mật khẩu
│   │   └── SetupPassword.jsx  # Đổi mật khẩu lần đầu
│   ├── services/
│   │   └── aiService.js       # Tích hợp Gemini API & Smart Local Expert Fallback
│   ├── utils/
│   │   └── formatters.js      # Format tiền tệ, đọc số Tiếng Việt, mã màu danh mục
│   ├── App.jsx                # Router & Điều hướng giao diện
│   ├── main.jsx               # Điểm khởi chạy React
│   └── index.css              # Hệ thống CSS Design System hoàn chỉnh
├── vercel.json                # File cấu hình deploy Vercel (SPA Rewrites)
├── vite.config.js             # Cấu hình Vite Build Tool
├── package.json               # Dependencies & NPM Scripts
└── source/                    # (Thư mục mã nguồn PHP gốc vẫn được giữ nguyên)
```

---

## 2. Hướng dẫn chạy Local (Máy cá nhân)

1. Mở Terminal tại thư mục gốc `CashFlow`:
   ```bash
   npm install
   ```
2. Khởi chạy máy chủ phát triển (Dev Server):
   ```bash
   npm run dev
   ```
3. Truy cập vào trình duyệt: [http://localhost:3000/](http://localhost:3000/)

---

## 3. Hướng dẫn Deploy lên Vercel (2 Cách)

### Cách 1: Deploy trực tiếp bằng Vercel CLI (Nhanh nhất)
1. Cài đặt hoặc chạy Vercel CLI:
   ```bash
   npx vercel
   ```
2. Làm theo hướng dẫn trên màn hình:
   - `Set up and deploy?`: Chọn **Y** (Yes)
   - `Which scope?`: Chọn tài khoản Vercel của bạn
   - `Link to existing project?`: Chọn **N** (No)
   - `Project name`: Nhập `cashflow` (hoặc tuỳ ý)
   - `In which directory is your code located?`: Để mặc định `./`
   - Vercel sẽ tự động phát hiện Framework: **Vite**
   - Output Directory: **dist**
3. Khi hoàn tất, Vercel sẽ cung cấp đường link dạng: `https://cashflow-xxx.vercel.app`.

### Cách 2: Deploy qua GitHub (Khuyên dùng)
1. Đẩy code lên GitHub repository của bạn.
2. Đăng nhập vào [vercel.com](https://vercel.com).
3. Nhấn **"Add New..."** -> **"Project"**.
4. Chọn repository GitHub vừa đẩy.
5. Vercel sẽ tự động nhận diện:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Nhấn nút **"Deploy"** và chờ khoảng 30 giây để hoàn tất!

---

## 4. Tùy chọn Cấu hình Gemini AI Key (Environment Variables)

Hệ thống đã được tích hợp 2 chế độ AI:
- **Chế độ 1 (Mặc định)**: Không cần API Key! Hệ thống tích hợp sẵn *Local Expert Financial Engine*, tự động phân tích dữ liệu thực tế của người dùng, đưa ra lời khuyên 3 phần (*TỔNG QUÁT*, *CỤ THỂ*, *KẾT LUẬN*) và tự động trích xuất giao dịch từ tiếng Việt tự nhiên (VD: "Đổ xăng 60k", "Ăn trưa 45k").
- **Chế độ 2 (Live Google Gemini API)**: Nếu muốn gọi trực tiếp Google Gemini:
  1. Trong cài đặt Vercel (Settings -> Environment Variables) hoặc file `.env.local` ở máy cá nhân, thêm biến:
     ```env
     VITE_GEMINI_API_KEY=AIzaSy...
     ```
  2. Redeploy hoặc khởi động lại dev server, hệ thống sẽ tự động chuyển sang gọi trực tiếp Gemini 1.5 Flash API của Google.

---

## 5. Tài khoản Đăng nhập Mẫu có sẵn

Dữ liệu đã được nạp sẵn 100% từ cơ sở dữ liệu `cashflow_db.sql`:

| Email | Mật khẩu | Vai trò | Ghi chú |
| :--- | :--- | :--- | :--- |
| `nvduy180706@gmail.com` | `123456` | Tài khoản chính | Đầy đủ 20+ giao dịch, ngân sách & lịch sử AI |
| `kdyforwork@gmail.com` | `123456` | Tài khoản phụ | Dữ liệu phụ |
