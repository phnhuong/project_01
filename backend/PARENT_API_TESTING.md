# Hướng dẫn Test API Parent Management bằng Postman

## Chuẩn bị
- Đảm bảo server đang chạy tại `http://localhost:3000`
- Mở Postman

---

## 1. Tạo Phụ huynh mới (Create Parent)

**Method:** `POST`  
**URL:** `http://localhost:3000/api/parents`  
**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "fullName": "Nguyen Van A",
  "phone": "0123456789"
}
```

**Kết quả mong đợi:**
- Status: `201 Created`
- Response trả về thông tin phụ huynh vừa tạo (có `id`)

**Lưu lại `id` để dùng cho các bước sau!**

---

## 2. Lấy danh sách Phụ huynh (Get All Parents)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/parents`

**Query Parameters (tùy chọn):**
- `page=1` (trang hiện tại)
- `limit=10` (số lượng mỗi trang)
- `search=Nguyen` (tìm kiếm theo tên hoặc SĐT)

**Ví dụ URL đầy đủ:**
```
http://localhost:3000/api/parents?page=1&limit=5&search=Nguyen
```

**Kết quả mong đợi:**
- Status: `200 OK`
- Response có cấu trúc:
```json
{
  "data": [...],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 3. Lấy chi tiết Phụ huynh (Get Parent by ID)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/parents/:id`

**Ví dụ:** `http://localhost:3000/api/parents/1`

**Kết quả mong đợi:**
- Status: `200 OK`
- Response trả về thông tin chi tiết phụ huynh + danh sách con (nếu có):
```json
{
  "id": 1,
  "fullName": "Nguyen Van A",
  "phone": "0123456789",
  "students": []
}
```

---

## 4. Cập nhật Phụ huynh (Update Parent)

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/parents/:id`

**Ví dụ:** `http://localhost:3000/api/parents/1`

**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "fullName": "Nguyen Van A (Updated)",
  "phone": "0987654321"
}
```

**Kết quả mong đợi:**
- Status: `200 OK`
- Response trả về thông tin đã cập nhật

---

## 5. Xóa Phụ huynh (Delete Parent)

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/parents/:id`

**Ví dụ:** `http://localhost:3000/api/parents/1`

**Kết quả mong đợi:**
- Status: `200 OK`
- Response:
```json
{
  "message": "Parent deleted successfully"
}
```

**Lưu ý:** Nếu phụ huynh có con, hệ thống sẽ tự động set `parentId` của các con về `null` trước khi xóa.

---

## Test Case nâng cao

### Test 1: Tạo phụ huynh với SĐT trùng
- Tạo phụ huynh mới với cùng `phone` đã tồn tại
- **Mong đợi:** Status `409 Conflict`, message: "Phone number already exists"

### Test 2: Lấy phụ huynh không tồn tại
- GET `/api/parents/999` (ID không tồn tại)
- **Mong đợi:** Status `404 Not Found`, message: "Parent not found"

### Test 3: Gán phụ huynh cho học sinh
1. Tạo phụ huynh mới, lưu `parentId`
2. Tạo học sinh mới với body:
```json
{
  "studentCode": "HS002",
  "fullName": "Tran Thi B",
  "dob": "2010-05-15",
  "gender": "Nữ",
  "parentId": 1
}
```
3. GET `/api/parents/1` → Sẽ thấy học sinh vừa tạo trong mảng `students`

---

## Troubleshooting

**Lỗi 500 Internal Server Error:**
- Kiểm tra console của server (terminal đang chạy `npm run dev`)
- Kiểm tra format JSON trong Body có đúng không

**Lỗi 400 Bad Request:**
- Thiếu trường bắt buộc (`fullName`, `phone`)
- Kiểm tra lại Body

**Lỗi 404 Not Found:**
- ID không tồn tại trong database
- Kiểm tra lại URL
