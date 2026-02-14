# Grade Management API - Test Report ✅

## Test Environment
- **Server:** http://localhost:3000
- **Endpoint:** /api/grades
- **Date:** 2026-02-13
- **Status:** Ready for testing

---

## Quick Test Guide

### 1. Create Grades (POST /api/grades)
```json
// Test 1: Khối 10
{
  "name": "Khối 10",
  "level": 10
}

// Test 2: Khối 11
{
  "name": "Khối 11",
  "level": 11
}

// Test 3: Khối 12
{
  "name": "Khối 12",
  "level": 12
}
```

### 2. Get All Grades (GET /api/grades)
Expected: Array sorted by level [10, 11, 12]

### 3. Get Grade by ID (GET /api/grades/1)
Expected: Returns Khối 10 details

### 4. Update Grade (PUT /api/grades/1)
```json
{
  "name": "Khối 10 (Updated)",
  "level": 10
}
```

### 5. Delete Grade (DELETE /api/grades/3)
Expected: Success if no classes exist

---

## Expected Test Results

| Test | Endpoint | Expected | Status |
|------|----------|----------|--------|
| 1 | POST /api/grades | 201 Created | ⏳ Pending |
| 2 | GET /api/grades | 200 OK, Array | ⏳ Pending |
| 3 | GET /api/grades/:id | 200 OK, Object | ⏳ Pending |
| 4 | PUT /api/grades/:id | 200 OK, Updated | ⏳ Pending |
| 5 | DELETE /api/grades/:id | 200 OK, Deleted | ⏳ Pending |
| 6 | Duplicate name | 409 Conflict | ⏳ Pending |
| 7 | Not found | 404 Not Found | ⏳ Pending |

---

## Code Quality Checklist

✅ Service Layer: CRUD operations implemented  
✅ Controller Layer: Request validation & error handling  
✅ Routes: All 5 endpoints registered  
✅ Delete Protection: Cannot delete grade with existing classes  
✅ Unique Constraint: Grade name must be unique  
✅ Sorting: Results ordered by level (ascending)

---

## Next Steps

After testing, please:
1. Test all endpoints above
2. Report any issues found
3. If all pass → Continue to **Subject Management**
