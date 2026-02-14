# Academic Year API - Quick Test Guide

## ✅ Test Checklist

Copy từng request dưới đây vào Postman và tick vào ô khi hoàn thành:

---

### Test 1: ✅ Tạo Năm học 2023-2024 (Active)

**Method:** POST  
**URL:** `http://localhost:3000/api/academic-years`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "name": "Năm học 2023-2024",
  "startDate": "2023-09-01",
  "endDate": "2024-06-30",
  "isCurrent": true
}
```

**Expected:** Status `201`, response có `id` và `isCurrent: true`

---

### Test 2: ✅ Tạo Năm học 2024-2025 (Inactive)

**Method:** POST  
**URL:** `http://localhost:3000/api/academic-years`  
**Body:**
```json
{
  "name": "Năm học 2024-2025",
  "startDate": "2024-09-01",
  "endDate": "2025-06-30",
  "isCurrent": false
}
```

**Expected:** Status `201`

---

### Test 3: ✅ Lấy danh sách tất cả

**Method:** GET  
**URL:** `http://localhost:3000/api/academic-years`

**Expected:** Mảng 2 năm học, sắp xếp theo `startDate` giảm dần

---

### Test 4: ✅ Lấy năm học đang active

**Method:** GET  
**URL:** `http://localhost:3000/api/academic-years/active`

**Expected:** Trả về năm 2023-2024 với `isCurrent: true`

---

### Test 5: ✅ Set năm 2024-2025 thành active

**Method:** PUT  
**URL:** `http://localhost:3000/api/academic-years/2`  
**Body:**
```json
{
  "isCurrent": true
}
```

**Expected:** Status `200`

**Kiểm tra:** Gọi lại `GET /active` → Phải trả về năm 2024-2025

---

### Test 6: ✅ Validation - Ngày không hợp lệ

**Method:** POST  
**URL:** `http://localhost:3000/api/academic-years`  
**Body:**
```json
{
  "name": "Năm học lỗi",
  "startDate": "2025-09-01",
  "endDate": "2024-06-30",
  "isCurrent": false
}
```

**Expected:** Status `400`, message: "Start date must be before end date"

---

### Test 7: ✅ Xóa năm học

**Method:** DELETE  
**URL:** `http://localhost:3000/api/academic-years/1`

**Expected:** Status `200`, message: "Academic year deleted successfully"

---

## 📝 Báo cáo kết quả

Sau khi test xong, điền vào bảng sau:

| Test | Status | Note |
|------|--------|------|
| 1. Create Active Year | ⬜ PASS / ⬜ FAIL | |
| 2. Create Inactive Year | ⬜ PASS / ⬜ FAIL | |
| 3. Get All | ⬜ PASS / ⬜ FAIL | |
| 4. Get Active | ⬜ PASS / ⬜ FAIL | |
| 5. Auto-deactivate Logic | ⬜ PASS / ⬜ FAIL | |
| 6. Date Validation | ⬜ PASS / ⬜ FAIL | |
| 7. Delete | ⬜ PASS / ⬜ FAIL | |

**Tổng kết:** ___ / 7 tests passed
