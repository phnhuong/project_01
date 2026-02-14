# Testing Quick Reference

## Test Data Setup Order

Follow this order to avoid foreign key errors:

```
1. Users (Teachers/Admins)
2. Academic Years
3. Grades
4. Subjects
5. Parents
6. Students
7. Classes
8. Enroll Students to Classes
9. Scores
```

---

## Sample Test Data

### 1. User (Teacher)
```json
{
  "username": "teacher01",
  "password": "password123",
  "fullName": "Nguyen Van A",
  "systemRoles": ["TEACHER"]
}
```

### 2. Academic Year
```json
{
  "name": "Năm học 2023-2024",
  "startDate": "2023-09-01",
  "endDate": "2024-06-30",
  "isCurrent": true
}
```

### 3. Grade
```json
{
  "name": "Khối 10",
  "level": 10
}
```

### 4. Subject
```json
{
  "code": "TOAN",
  "name": "Toán học"
}
```

### 5. Parent
```json
{
  "fullName": "Tran Thi B",
  "phone": "0123456789"
}
```

### 6. Student
```json
{
  "studentCode": "HS001",
  "fullName": "Tran Van C",
  "dob": "2008-05-15",
  "gender": "Nam",
  "parentId": 1
}
```

### 7. Class
```json
{
  "name": "10A1",
  "gradeId": 1,
  "academicYearId": 1,
  "homeroomTeacherId": 1
}
```

### 8. Enrollment
```json
{
  "studentId": 1
}
```
POST to `/api/classes/1/students`

### 9. Score
```json
{
  "studentId": 1,
  "subjectId": 1,
  "classId": 1,
  "scoreType": "MIDTERM",
  "value": 8.5
}
```

---

## Common Test Scenarios

### Scenario 1: Complete Student Lifecycle
1. Create parent
2. Create student with parentId
3. Create class
4. Enroll student to class
5. Create scores for student
6. Update scores
7. View student report (GET scores?studentId=X)

### Scenario 2: Class Management
1. Create academic year
2. Create grade
3. Create class
4. Enroll multiple students
5. View class roster (GET classes/:id)
6. Remove a student
7. Delete class (should fail if scores exist)

### Scenario 3: Score Entry
1. Ensure student is enrolled in class
2. Create MIDTERM score
3. Create FINAL score
4. Create REGULAR scores
5. View all scores for class
6. Calculate average (frontend task)

---

## Validation Test Cases

### Test Invalid Data

#### 1. Missing Required Fields
```json
POST /api/students
{}
```
Expected: 400

#### 2. Invalid Foreign Key
```json
POST /api/students
{
  "studentCode": "HS999",
  "fullName": "Test",
  "dob": "2008-01-01",
  "gender": "Nam",
  "parentId": 9999
}
```
Expected: 400 (P2003)

#### 3. Duplicate Unique Field
```json
POST /api/subjects
{
  "code": "TOAN",
  "name": "Duplicate"
}
```
Expected: 409 (P2002)

#### 4. Score Out of Range
```json
POST /api/scores
{
  "studentId": 1,
  "subjectId": 1,
  "classId": 1,
  "scoreType": "MIDTERM",
  "value": 15
}
```
Expected: 400

#### 5. Student Not Enrolled
```json
POST /api/scores
{
  "studentId": 999,
  "subjectId": 1,
  "classId": 1,
  "scoreType": "MIDTERM",
  "value": 8
}
```
Expected: 400

---

## Performance Test Cases

### 1. Pagination
```
GET /api/students?page=1&limit=5
GET /api/students?page=2&limit=5
```
Verify: Different results, correct total count

### 2. Search
```
GET /api/students?search=Nguyen
GET /api/parents?search=0123
```
Verify: Only matching results returned

### 3. Filtering
```
GET /api/classes?academicYearId=1
GET /api/scores?classId=1&subjectId=1
```
Verify: Correct filtering applied

---

## Security Test Cases

### 1. Protected Routes
```
GET /api/auth/me
```
Without token: 401  
With token: 200

### 2. Password Hashing
Create user → Check database → Password should be hashed

### 3. Soft Delete
Delete user → Check database → `isActive: false`, not removed

---

## Postman Collection Structure

```
Student Management API/
├── Auth/
│   ├── Login
│   └── Get Me
├── Users/
│   ├── Get All
│   ├── Get One
│   ├── Create
│   ├── Update
│   └── Delete
├── Students/
│   └── (5 requests)
├── Parents/
│   └── (5 requests)
├── Academic Years/
│   └── (6 requests)
├── Grades/
│   └── (5 requests)
├── Subjects/
│   └── (5 requests)
├── Classes/
│   └── (8 requests)
└── Scores/
    └── (6 requests)
```

---

## Testing Tools

### Recommended
- **Postman** - GUI, easy to use
- **Thunder Client** (VS Code) - Lightweight
- **cURL** - Command line

### Environment Variables (Postman)
```
baseUrl: http://localhost:3000
token: <JWT token from login>
```

Usage: `{{baseUrl}}/api/users`
