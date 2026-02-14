# Hướng dẫn Test API Academic Year Management

## Chuẩn bị
- Server đang chạy tại `http://localhost:3000`
- Mở Postman

---

## Test Scenarios

### 1. Tạo Năm học đầu tiên (Active)

**Method:** `POST`  
**URL:** `http://localhost:3000/api/academic-years`  
**Body:**
```json
{
  "name": "Năm học 2023-2024",
  "startDate": "2023-09-01",
  "endDate": "2024-06-30",
  "isActive": true
}
```

**Kết quả mong đợi:** Status `201`, trả về năm học với `isActive: true`

---

### 2. Tạo Năm học thứ 2 (Không active)

**Method:** `POST`  
**URL:** `http://localhost:3000/api/academic-years`  
**Body:**
```json
{
  "name": "Năm học 2024-2025",
  "startDate": "2024-09-01",
  "endDate": "2025-06-30",
  "isActive": false
}
```

**Kết quả mong đợi:** Status `201`

---

### 3. Lấy danh sách Năm học

**Method:** `GET`  
**URL:** `http://localhost:3000/api/academic-years`

**Kết quả mong đợi:** Mảng 2 năm học, sắp xếp theo `startDate` giảm dần

---

### 4. Lấy Năm học đang Active

**Method:** `GET`  
**URL:** `http://localhost:3000/api/academic-years/active`

**Kết quả mong đợi:** Trả về năm học 2023-2024 (năm đầu tiên)

---

### 5. Set Năm học thứ 2 thành Active

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/academic-years/2` (ID của năm thứ 2)  
**Body:**
```json
{
  "isActive": true
}
```

**Kết quả mong đợi:** 
- Status `200`
- Năm thứ 2 → `isActive: true`
- **Quan trọng:** Gọi lại `GET /active` → Phải trả về năm thứ 2 (năm đầu tự động bị set về `false`)

---

### 6. Test Validation: Ngày không hợp lệ

**Method:** `POST`  
**URL:** `http://localhost:3000/api/academic-years`  
**Body:**
```json
{
  "name": "Năm học lỗi",
  "startDate": "2025-09-01",
  "endDate": "2024-06-30",
  "isActive": false
}
```

**Kết quả mong đợi:** Status `400`, message: "Start date must be before end date"

---

### 7. Test Delete Protection

**Bước 1:** Tạo 1 lớp học thuộc năm học ID=1 (cần làm sau khi có Class API)

**Bước 2:** Thử xóa năm học đó  
**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/academic-years/1`

**Kết quả mong đợi:** Status `400`, message: "Cannot delete academic year with existing classes"

---

## Checklist Test

- [ ] Tạo năm học thành công
- [ ] Lấy danh sách năm học
- [ ] Lấy năm học active
- [ ] **Logic đặc biệt:** Khi set năm mới active, năm cũ tự động inactive
- [ ] Validation ngày tháng
- [ ] Xóa năm học (khi chưa có lớp)
- [ ] Không cho xóa năm học có lớp (test sau)

---

## Kết quả Test

Sau khi test xong, hãy báo cáo:
1. ✅ Các API nào đã pass
2. ❌ Có lỗi gì không
3. 📝 Ghi chú đặc biệt (nếu có)
