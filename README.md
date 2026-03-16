# 🌿 Dự án Quản lý Tảo xoắn Spirulina

Dự án này là một hệ thống REST API được xây dựng bằng **Node.js** và **Express**, dùng để quản lý và theo dõi dữ liệu từ các cảm biến trong hệ thống nuôi trồng Tảo xoắn Spirulina.

## 🚀 Tính năng chính
- Quản lý dữ liệu cảm biến (Nhiệt độ, Độ pH, Độ mặn, v.v.)
- Hệ thống xác thực bằng JWT (JSON Web Token).
- Tích hợp tài liệu API tự động với **Swagger**.
- Tự động hóa các tác vụ định kỳ (Cron Jobs).
- Giao diện Dashboard cơ bản đi kèm.

---

## 🛠️ Yêu cầu hệ thống
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
- [Node.js](https://nodejs.org/) (Phiên bản 18.x trở lên)
- [MongoDB](https://www.mongodb.com/try/download/community) (Đang chạy tại local hoặc sử dụng MongoDB Atlas)

---

## ⚙️ Cài đặt & Cấu hình

### 1. Cài đặt phụ thuộc
Mở terminal tại thư mục gốc của dự án và chạy lệnh sau:
```bash
npm install
```

### 2. Thiết lập biến môi trường
Tạo một file `.env` tại thư mục gốc (nếu chưa có) và sao chép nội dung mẫu sau:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/spirulina_db
JWT_SECRET=your_super_secret_key_here
```
*Lưu ý: Bạn có thể thay đổi cổng hoặc URI của MongoDB cho phù hợp với môi trường của mình.*

---

## 🏃 Cách khởi chạy

### Chế độ phát triển (Sử dụng Nodemon)
Server sẽ tự động khởi động lại khi bạn lưu file:
```bash
npm run dev
```

### Chế độ Product
```bash
npm start
```

Mặc định, server sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 📘 Tài liệu API (Swagger)
Dự án tích hợp sẵn Swagger UI giúp bạn dễ dàng thử nghiệm các API endpoint. Sau khi chạy server, hãy truy cập đường dẫn sau để xem tài liệu chi tiết:

🔗 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 📂 Cấu trúc thư mục chính
```text
/public       - Chứa mã nguồn Frontend (HTML, CSS, JS)
/src
  /config     - Cấu hình Database, Swagger, v.v.
  /controllers - Xử lý logic nghiệp vụ
  /models     - Định nghĩa lược đồ dữ liệu (Mongoose)
  /routes     - Định nghĩa các tuyến API
  /services   - Chứa logic xử lý các tác vụ nền (Cron Jobs)
  app.js      - File khởi tạo ứng dụng chính
```

---

## 📌 Các lưu ý quan trọng
- Đảm bảo dịch vụ **MongoDB** đã được khởi động trước khi chạy lệnh khởi chạy server.
- Nếu bạn sử dụng MongoDB Atlas (đám mây), hãy cập nhật `MONGO_URI` trong file `.env` bằng đường dẫn kết nối của bạn.
