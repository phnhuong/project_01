# Hướng dẫn Sử dụng Postman để Test API

Đây là hướng dẫn chi tiết từng bước dành cho người mới bắt đầu để kiểm tra các API của Backend.

## Chuẩn bị
1.  Đảm bảo Backend Server đang chạy (`npm run dev` tại thư mục backend).
2.  Tải và cài đặt [Postman](https://www.postman.com/downloads/).

---

## Phần 1: Tạo Collection (Thư mục chứa API)
1.  Mở Postman.
2.  Nhìn bên trái, chọn **Collections**.
3.  Bấm nút **(+)** hoặc **Create new collection**.
4.  Đặt tên là `Student Management`.

---

## Phần 2: Test API Đăng nhập (Login)
API này dùng để lấy **Token** (chìa khóa) để truy cập các bước sau.

1.  Trong Collection `Student Management`, bấm dấu **(...)** -> **Add Request**.
2.  Đặt tên request là `Login`.
3.  Chỉnh **Method** (cạnh thanh địa chỉ) từ `GET` thành `POST`.
4.  Nhập **URL**: `http://localhost:3000/api/auth/login`.
5.  Chọn tab **Body** (bên dưới thanh URL).
6.  Chọn **raw**.
7.  Chọn định dạng **JSON** (thay vì Text).
8.  Nhập nội dung sau vào ô trống:
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```
9.  Bấm nút **Send** (màu xanh dương).
10. **Kết quả:** Nhìn xuống phần Response (bên dưới), bạn sẽ thấy:
    ```json
    {
        "user": { ... },
        "token": "eyJhbGciOiJIUzI1NiIs..."
    }
    ```
11. **QUAN TRỌNG:** Copy chuỗi `token` này (dòng dài loằng ngoằng trong dấu ngoặc kép).

---

## Phần 3: Test API Bảo mật (Get Me)
API này yêu cầu phải có Token mới cho xem dữ liệu.

1.  Trong Collection, tạo thêm Request mới tên là `Get Me`.
2.  Giữ nguyên Method là `GET`.
3.  Nhập **URL**: `http://localhost:3000/api/auth/me`.
4.  Chọn tab **Auth** (hoặc **Authorization**).
5.  Ở cột **Type**, chọn **Bearer Token**.
6.  Ở ô **Token** bên phải: Dán chuỗi token bạn vừa copy ở Bước 2 vào.
7.  Bấm **Send**.
8.  **Kết quả:**
    - Cần thấy: `Status: 200 OK` và thông tin user ở dưới.
    - Nếu thấy: `401 Unauthorized` hoặc `403 Forbidden` -> Token sai hoặc hết hạn.

---

## Phần 4: Test API Server (Health Check)
1.  Tạo Request mới tên `Health Check`.
2.  Method `GET`.
3.  URL: `http://localhost:3000`.
4.  Không cần Body hay Auth gì cả.
5.  Bấm **Send**.
6.  Kết quả: `Student Management API is running!`.
