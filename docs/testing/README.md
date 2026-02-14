# Testing Documentation Index

## Overview
This directory contains comprehensive testing documentation for the Student Management System backend API.

---

## Documents

### 1. [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
**Complete API reference with all 47+ endpoints**

- Organized by module (9 modules)
- Request/response examples for each endpoint
- Error codes reference
- Prisma error codes explained
- Testing checklist

**Use this for:** Detailed endpoint documentation and comprehensive testing

---

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Quick reference for common testing scenarios**

- Test data setup order
- Sample test data (copy-paste ready)
- Common test scenarios
- Validation test cases
- Performance & security tests
- Postman collection structure

**Use this for:** Quick lookups and test data templates

---

## Testing Workflow

### Step 1: Setup
1. Ensure backend server is running (`npm run dev`)
2. Database is migrated and seeded
3. Postman or similar tool ready

### Step 2: Follow Setup Order
```
Users → Academic Years → Grades → Subjects → 
Parents → Students → Classes → Enrollments → Scores
```

### Step 3: Test Each Module
- Use `API_TESTING_GUIDE.md` for detailed test cases
- Use `QUICK_REFERENCE.md` for sample data
- Check off items as you test

### Step 4: Validation Testing
- Test error cases (missing fields, invalid IDs, etc.)
- Test business logic (enrollment validation, score range, etc.)
- Test delete protection

### Step 5: Report Results
Document any issues found with:
- Endpoint
- Request body
- Expected vs actual response
- Error message

---

## Quick Start Example

### 1. Login
```bash
POST http://localhost:3000/api/auth/login
Body: {"username":"admin","password":"admin123"}
```
Save the token!

### 2. Create a Grade
```bash
POST http://localhost:3000/api/grades
Body: {"name":"Khối 10","level":10}
```

### 3. Get All Grades
```bash
GET http://localhost:3000/api/grades
```

---

## Test Coverage

| Module | Endpoints | Status |
|--------|-----------|--------|
| Authentication | 2 | ✅ Tested |
| Users | 5 | ✅ Tested |
| Students | 5 | ✅ Tested |
| Parents | 5 | ✅ Tested |
| Academic Years | 6 | ✅ Tested |
| Grades | 5 | ⏳ Pending |
| Subjects | 5 | ⏳ Pending |
| Classes | 8 | ⏳ Pending |
| Scores | 6 | ⏳ Pending |

---

## Additional Resources

- **Backend Code:** `../backend/src/`
- **Database Schema:** `../backend/prisma/schema.prisma`
- **API Spec:** `../docs/04.API_SPECIFICATION.md`
- **Test Plan:** `../docs/08.TEST_PLAN.md`

---

## Notes

- All endpoints require proper error handling
- Foreign key relationships must be respected
- Soft deletes are used for Users and Students
- Score values must be 0-10
- Students must be enrolled before scoring
