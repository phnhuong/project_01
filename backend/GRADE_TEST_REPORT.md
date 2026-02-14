# Grade Management API - Test Report

## Test Environment
- **Server:** http://localhost:3000
- **Endpoint:** /api/grades
- **Date:** 2026-02-13
- **Tester:** Manual testing via Postman

---

## Test Cases & Results

### ✅ Test 1: Create Grade - Khối 10
**Request:**
```
POST /api/grades
Body: {
  "name": "Khối 10",
  "level": 10
}
```
**Expected:** Status 201, returns grade with ID
**Result:** ⬜ PASS / ⬜ FAIL
**Notes:** _____________

---

### ✅ Test 2: Create Grade - Khối 11
**Request:**
```
POST /api/grades
Body: {
  "name": "Khối 11",
  "level": 11
}
```
**Expected:** Status 201
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 3: Create Grade - Khối 12
**Request:**
```
POST /api/grades
Body: {
  "name": "Khối 12",
  "level": 12
}
```
**Expected:** Status 201
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 4: Get All Grades
**Request:**
```
GET /api/grades
```
**Expected:** Array of 3 grades, sorted by level (10, 11, 12)
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 5: Get Grade by ID
**Request:**
```
GET /api/grades/1
```
**Expected:** Returns Khối 10 details
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 6: Update Grade
**Request:**
```
PUT /api/grades/1
Body: {
  "name": "Khối 10 (Updated)",
  "level": 10
}
```
**Expected:** Status 200, returns updated grade
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 7: Duplicate Name Validation
**Request:**
```
POST /api/grades
Body: {
  "name": "Khối 10",
  "level": 10
}
```
**Expected:** Status 409, message: "Grade name already exists"
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 8: Delete Grade
**Request:**
```
DELETE /api/grades/3
```
**Expected:** Status 200, message: "Grade deleted successfully"
**Result:** ⬜ PASS / ⬜ FAIL

---

### ✅ Test 9: Get Non-existent Grade
**Request:**
```
GET /api/grades/999
```
**Expected:** Status 404, message: "Grade not found"
**Result:** ⬜ PASS / ⬜ FAIL

---

## Summary

| Category | Count |
|----------|-------|
| Total Tests | 9 |
| Passed | ___ |
| Failed | ___ |
| Pass Rate | ___% |

---

## Issues Found
1. _____________
2. _____________

---

## Recommendations
- [ ] Seed default grades (Khối 1-12) in database
- [ ] Add validation for level range (1-12)
- [ ] Consider adding description field for grades
