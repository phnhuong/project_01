# Hướng dẫn Kiểm thử Backend (API)

Hiện tại Backend đã có các chức năng:
1.  **Seed Data:** Tạo dữ liệu mẫu.
2.  **Authentication:** Đăng nhập và lấy Token.

## Cách 1: Sử dụng Script tự động (Nhanh nhất)

Mình đóng gói sẵn check script, bạn chỉ cần chạy lệnh sau:

1.  Mở terminal tại thư mục `backend`.
2.  Start server (nếu chưa chạy):
    ```bash
    npm run dev
    ```
3.  Mở **một terminal khác**, chạy script kiểm tra:
    ```bash
    npx ts-node scripts/verify_auth.ts
    ```

**Kết quả mong đợi:**
- Login thành công -> In ra Token.
- Truy cập Protected Route (`/me`) thành công -> In ra thông tin User.
- Token sai -> Báo lỗi 403 Forbidden.

---

## Cách 2: Test thủ công bằng Postman / Thunder Client

### 1. API Đăng nhập (Login)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response:**
  ```json
  {
      "user": { ... },
      "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```

### 2. API Kiểm tra thông tin (Protected Route)
Sau khi có `token` ở bước trên:
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer <token_copy_tu_buoc_login>` (Lưu ý có chữ `Bearer ` và dấu cách).

---

## Cách 3: Dùng cURL (Command Line)

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d "{\"username\":\"admin\", \"password\":\"admin123\"}"
```

**Get Me (thay TOKEN vào):**
```bash
curl -X GET http://localhost:3000/api/auth/me \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```
