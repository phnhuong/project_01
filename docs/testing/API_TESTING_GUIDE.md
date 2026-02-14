# API Testing Documentation - Student Management System

## Overview
This document contains comprehensive test cases for all backend API endpoints.

**Total Modules:** 9  
**Total Endpoints:** 48  
**Testing Method:** Manual (Postman/cURL)

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [User Management](#2-user-management)
3. [Student Management](#3-student-management)
4. [Parent Management](#4-parent-management)
5. [Academic Year Management](#5-academic-year-management)
6. [Grade Management](#6-grade-management)
7. [Subject Management](#7-subject-management)
8. [Class Management](#8-class-management)
9. [Score Management](#9-score-management)

---

## 1. Authentication

**Base URL:** `http://localhost:3000/api/auth`

### 1.1 Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```
**Expected:** 200, returns `{ token: "..." }`

### 1.2 Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>
```
**Expected:** 200, returns user info

---

## 2. User Management

**Base URL:** `http://localhost:3000/api/users`

### 2.1 Get All Users
```http
GET /api/users?page=1&limit=10&search=admin
```
**Expected:** 200, returns paginated users (no passwords)

### 2.2 Get User by ID
```http
GET /api/users/1
```
**Expected:** 200, returns user details

### 2.3 Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "teacher01",
  "password": "password123",
  "fullName": "Nguyen Van A",
  "systemRoles": ["TEACHER"]
}
```
**Expected:** 201, returns created user

### 2.4 Update User
```http
PUT /api/users/1
Content-Type: application/json

{
  "fullName": "Nguyen Van A (Updated)",
  "password": "newpassword123"
}
```
**Expected:** 200, returns updated user

### 2.5 Delete User (Soft Delete)
```http
DELETE /api/users/1
```
**Expected:** 200, sets `isActive: false`

---

## 3. Student Management

**Base URL:** `http://localhost:3000/api/students`

### 3.1 Get All Students
```http
GET /api/students?page=1&limit=10&search=Nguyen
```
**Expected:** 200, returns paginated students

### 3.2 Get Student by ID
```http
GET /api/students/1
```
**Expected:** 200, returns student with parent info

### 3.3 Create Student
```http
POST /api/students
Content-Type: application/json

{
  "studentCode": "HS001",
  "fullName": "Le Van Ty",
  "dob": "2008-01-01",
  "gender": "Nam",
  "parentId": 1
}
```
**Expected:** 201, returns created student

### 3.4 Update Student
```http
PUT /api/students/1
Content-Type: application/json

{
  "fullName": "Le Van Ty (Updated)",
  "dob": "2008-01-01",
  "gender": "Nam"
}
```
**Expected:** 200, returns updated student

### 3.5 Delete Student (Soft Delete)
```http
DELETE /api/students/1
```
**Expected:** 200, sets `isDeleted: true`

---

## 4. Parent Management

**Base URL:** `http://localhost:3000/api/parents`

### 4.1 Get All Parents
```http
GET /api/parents?page=1&limit=10&search=0123
```
**Expected:** 200, returns parents with students

### 4.2 Get Parent by ID
```http
GET /api/parents/1
```
**Expected:** 200, returns parent with children list

### 4.3 Create Parent
```http
POST /api/parents
Content-Type: application/json

{
  "fullName": "Nguyen Van A",
  "phone": "0123456789"
}
```
**Expected:** 201, returns created parent

### 4.4 Update Parent
```http
PUT /api/parents/1
Content-Type: application/json

{
  "fullName": "Nguyen Van A (Updated)",
  "phone": "0987654321"
}
```
**Expected:** 200, returns updated parent

### 4.5 Delete Parent
```http
DELETE /api/parents/1
```
**Expected:** 200, auto-sets children's `parentId` to null

---

## 5. Academic Year Management

**Base URL:** `http://localhost:3000/api/academic-years`

### 5.1 Get All Academic Years
```http
GET /api/academic-years
```
**Expected:** 200, returns all years sorted by startDate desc

### 5.2 Get Active Academic Year
```http
GET /api/academic-years/active
```
**Expected:** 200, returns current active year

### 5.3 Get Academic Year by ID
```http
GET /api/academic-years/1
```
**Expected:** 200, returns year details

### 5.4 Create Academic Year
```http
POST /api/academic-years
Content-Type: application/json

{
  "name": "Năm học 2023-2024",
  "startDate": "2023-09-01",
  "endDate": "2024-06-30",
  "isCurrent": true
}
```
**Expected:** 201, auto-deactivates other years if `isCurrent: true`

### 5.5 Update Academic Year
```http
PUT /api/academic-years/1
Content-Type: application/json

{
  "isCurrent": true
}
```
**Expected:** 200, auto-deactivates other years

### 5.6 Delete Academic Year
```http
DELETE /api/academic-years/1
```
**Expected:** 200 (if no classes) OR 400 (if classes exist)

---

## 6. Grade Management

**Base URL:** `http://localhost:3000/api/grades`

### 6.1 Get All Grades
```http
GET /api/grades
```
**Expected:** 200, returns grades sorted by level

### 6.2 Get Grade by ID
```http
GET /api/grades/1
```
**Expected:** 200, returns grade details

### 6.3 Create Grade
```http
POST /api/grades
Content-Type: application/json

{
  "name": "Khối 10",
  "level": 10
}
```
**Expected:** 201, returns created grade

### 6.4 Update Grade
```http
PUT /api/grades/1
Content-Type: application/json

{
  "name": "Khối 10 (Updated)",
  "level": 10
}
```
**Expected:** 200, returns updated grade

### 6.5 Delete Grade
```http
DELETE /api/grades/1
```
**Expected:** 200 (if no classes) OR 400 (if classes exist)

---

## 7. Subject Management

**Base URL:** `http://localhost:3000/api/subjects`

### 7.1 Get All Subjects
```http
GET /api/subjects
```
**Expected:** 200, returns subjects sorted by code

### 7.2 Get Subject by ID
```http
GET /api/subjects/1
```
**Expected:** 200, returns subject details

### 7.3 Create Subject
```http
POST /api/subjects
Content-Type: application/json

{
  "code": "TOAN",
  "name": "Toán học"
}
```
**Expected:** 201, returns created subject

### 7.4 Update Subject
```http
PUT /api/subjects/1
Content-Type: application/json

{
  "code": "TOAN",
  "name": "Toán học (Updated)"
}
```
**Expected:** 200, returns updated subject

### 7.5 Delete Subject
```http
DELETE /api/subjects/1
```
**Expected:** 200 (if no assignments/scores) OR 400

---

## 8. Class Management

**Base URL:** `http://localhost:3000/api/classes`

### 8.1 Get All Classes
```http
GET /api/classes
```
**Expected:** 200, returns classes with grade, year, teacher info

### 8.2 Filter Classes
```http
GET /api/classes?academicYearId=1&gradeId=1
```
**Expected:** 200, returns filtered classes

### 8.3 Get Class by ID
```http
GET /api/classes/1
```
**Expected:** 200, returns class with enrolled students

### 8.4 Create Class
```http
POST /api/classes
Content-Type: application/json

{
  "name": "10A1",
  "gradeId": 1,
  "academicYearId": 1,
  "homeroomTeacherId": 1
}
```
**Expected:** 201, returns created class

### 8.5 Update Class
```http
PUT /api/classes/1
Content-Type: application/json

{
  "name": "10A1 (Updated)",
  "gradeId": 1,
  "academicYearId": 1
}
```
**Expected:** 200, returns updated class

### 8.6 Enroll Student
```http
POST /api/classes/1/students
Content-Type: application/json

{
  "studentId": 1
}
```
**Expected:** 201, creates enrollment

### 8.7 Remove Student
```http
DELETE /api/classes/1/students/1
```
**Expected:** 200, removes enrollment

### 8.8 Delete Class
```http
DELETE /api/classes/1
```
**Expected:** 200 (if no enrollments/scores) OR 400

---

## 9. Score Management

**Base URL:** `http://localhost:3000/api/scores`

### 9.1 Get All Scores
```http
GET /api/scores
```
**Expected:** 200, returns scores with student, subject, class info

### 9.2 Filter Scores
```http
GET /api/scores?classId=1&studentId=1&subjectId=1
```
**Expected:** 200, returns filtered scores

### 9.3 Get Score by ID
```http
GET /api/scores/1
```
**Expected:** 200, returns score details

### 9.4 Create Score
```http
POST /api/scores
Content-Type: application/json

{
  "studentId": 1,
  "subjectId": 1,
  "classId": 1,
  "scoreType": "MIDTERM",
  "value": 8.5
}
```
**Expected:** 201, validates enrollment & range (0-10)

### 9.5 Update Score
```http
PUT /api/scores/1
Content-Type: application/json

{
  "scoreType": "FINAL",
  "value": 9.0
}
```
**Expected:** 200, returns updated score

### 9.6 Delete Score
```http
DELETE /api/scores/1
```
**Expected:** 200, deletes score

---

## Error Codes Reference

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Missing fields, validation error |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate unique field |
| 500 | Server Error | Database/server issue |

### Prisma Error Codes
- **P2002:** Unique constraint violation
- **P2003:** Foreign key constraint violation
- **P2025:** Record not found

---

## Testing Checklist

- [ ] Authentication (2 endpoints)
- [ ] Users (5 endpoints)
- [ ] Students (5 endpoints)
- [ ] Parents (5 endpoints)
- [ ] Academic Years (6 endpoints)
- [ ] Grades (5 endpoints)
- [ ] Subjects (5 endpoints)
- [ ] Classes (8 endpoints)
- [ ] Scores (6 endpoints)

**Total:** 47 endpoints
