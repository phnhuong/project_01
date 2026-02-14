# Manual Testing Guide - Remaining Modules

## Testing Order
Test theo thứ tự dependencies: **Grades → Subjects → Classes → Scores**

---

## 1. Grade Management Testing

### Setup
Server: `http://localhost:3000/api/grades`

### Test Cases

#### 1.1 Create Grades
```json
POST /api/grades
Body: {"name":"Khối 10","level":10}
Expected: 201, returns grade with ID

POST /api/grades
Body: {"name":"Khối 11","level":11}
Expected: 201

POST /api/grades
Body: {"name":"Khối 12","level":12}
Expected: 201
```

#### 1.2 Get All Grades
```
GET /api/grades
Expected: Array of 3 grades, sorted by level (10, 11, 12)
```

#### 1.3 Get Grade by ID
```
GET /api/grades/1
Expected: Grade 10 details
```

#### 1.4 Update Grade
```json
PUT /api/grades/1
Body: {"name":"Khối 10 (Updated)","level":10}
Expected: 200, updated grade
```

#### 1.5 Duplicate Name Test
```json
POST /api/grades
Body: {"name":"Khối 11","level":11}
Expected: 409 Conflict
```

#### 1.6 Delete Grade
```
DELETE /api/grades/3
Expected: 200 (if no classes exist)
```

**Result:** ⬜ PASS / ⬜ FAIL

---

## 2. Subject Management Testing

### Setup
Server: `http://localhost:3000/api/subjects`

### Test Cases

#### 2.1 Create Subjects
```json
POST /api/subjects
Body: {"code":"TOAN","name":"Toán học"}
Expected: 201

POST /api/subjects
Body: {"code":"VAN","name":"Ngữ văn"}
Expected: 201

POST /api/subjects
Body: {"code":"ANH","name":"Tiếng Anh"}
Expected: 201
```

#### 2.2 Get All Subjects
```
GET /api/subjects
Expected: Array of 3 subjects, sorted by code
```

#### 2.3 Get Subject by ID
```
GET /api/subjects/1
Expected: Subject details
```

#### 2.4 Update Subject
```json
PUT /api/subjects/1
Body: {"code":"TOAN","name":"Toán học (Updated)"}
Expected: 200
```

#### 2.5 Duplicate Code Test
```json
POST /api/subjects
Body: {"code":"TOAN","name":"Toán"}
Expected: 409 Conflict
```

#### 2.6 Delete Subject
```
DELETE /api/subjects/3
Expected: 200 (if no assignments/scores exist)
```

**Result:** ⬜ PASS / ⬜ FAIL

---

## 3. Class Management Testing

### Prerequisites
- At least 1 Academic Year created
- At least 1 Grade created
- At least 1 User (teacher) created
- At least 1 Student created

### Setup
Server: `http://localhost:3000/api/classes`

### Test Cases

#### 3.1 Create Class
```json
POST /api/classes
Body: {
  "name":"10A1",
  "gradeId":1,
  "academicYearId":1,
  "homeroomTeacherId":1
}
Expected: 201
```

#### 3.2 Get All Classes
```
GET /api/classes
Expected: Array of classes with grade, academicYear, teacher info
```

#### 3.3 Filter by Academic Year
```
GET /api/classes?academicYearId=1
Expected: Classes for that year only
```

#### 3.4 Filter by Grade
```
GET /api/classes?gradeId=1
Expected: Classes for that grade only
```

#### 3.5 Get Class Detail (with students)
```
GET /api/classes/1
Expected: Class info + enrollments array
```

#### 3.6 Enroll Student to Class
```json
POST /api/classes/1/students
Body: {"studentId":1}
Expected: 201, enrollment created
```

#### 3.7 Get Class Detail Again
```
GET /api/classes/1
Expected: Should now show 1 student in enrollments
```

#### 3.8 Remove Student from Class
```
DELETE /api/classes/1/students/1
Expected: 200
```

#### 3.9 Update Class
```json
PUT /api/classes/1
Body: {"name":"10A1 (Updated)","gradeId":1,"academicYearId":1}
Expected: 200
```

#### 3.10 Delete Class
```
DELETE /api/classes/1
Expected: 200 (if no enrollments/scores)
OR 400 if enrollments exist
```

**Result:** ⬜ PASS / ⬜ FAIL

---

## 4. Score Management Testing

### Prerequisites
- At least 1 Class created
- At least 1 Student enrolled in that class
- At least 1 Subject created

### Setup
Server: `http://localhost:3000/api/scores`

### Test Cases

#### 4.1 Create Score (Valid)
```json
POST /api/scores
Body: {
  "studentId":1,
  "subjectId":1,
  "classId":1,
  "scoreType":"MIDTERM",
  "value":8.5
}
Expected: 201
```

#### 4.2 Create Score (Invalid - Not Enrolled)
```json
POST /api/scores
Body: {
  "studentId":999,
  "subjectId":1,
  "classId":1,
  "scoreType":"FINAL",
  "value":9.0
}
Expected: 400 "Student is not enrolled in this class"
```

#### 4.3 Create Score (Invalid - Out of Range)
```json
POST /api/scores
Body: {
  "studentId":1,
  "subjectId":1,
  "classId":1,
  "scoreType":"REGULAR",
  "value":11
}
Expected: 400 "Score value must be between 0 and 10"
```

#### 4.4 Get All Scores
```
GET /api/scores
Expected: Array with student, subject, class info
```

#### 4.5 Filter by Class
```
GET /api/scores?classId=1
Expected: Scores for that class only
```

#### 4.6 Filter by Student
```
GET /api/scores?studentId=1
Expected: All scores for that student
```

#### 4.7 Filter by Subject
```
GET /api/scores?subjectId=1
Expected: All scores for that subject
```

#### 4.8 Get Score Detail
```
GET /api/scores/1
Expected: Score with full student, subject, class info
```

#### 4.9 Update Score
```json
PUT /api/scores/1
Body: {"scoreType":"MIDTERM","value":9.0}
Expected: 200
```

#### 4.10 Delete Score
```
DELETE /api/scores/1
Expected: 200
```

**Result:** ⬜ PASS / ⬜ FAIL

---

## Testing Summary

| Module | Total Tests | Passed | Failed | Notes |
|--------|-------------|--------|--------|-------|
| Grades | 6 | ___ | ___ | |
| Subjects | 6 | ___ | ___ | |
| Classes | 10 | ___ | ___ | |
| Scores | 10 | ___ | ___ | |
| **Total** | **32** | ___ | ___ | |

---

## Common Issues & Solutions

### Issue 1: Foreign Key Errors (P2003)
**Symptom:** "Invalid gradeId, academicYearId..."  
**Solution:** Ensure referenced records exist first

### Issue 2: Unique Constraint (P2002)
**Symptom:** "Already exists"  
**Solution:** Use different name/code

### Issue 3: Not Found (P2025)
**Symptom:** "Record not found"  
**Solution:** Check ID exists in database

### Issue 4: Enrollment Validation
**Symptom:** "Student is not enrolled"  
**Solution:** Enroll student first via `/api/classes/:id/students`

---

## Next Steps After Testing

1. ✅ If all tests pass → Backend is production-ready
2. ❌ If tests fail → Report issues for fixing
3. 📝 Document any edge cases found
4. 🚀 Proceed to frontend development or deployment
