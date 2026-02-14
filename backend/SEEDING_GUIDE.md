# Database Seeding Guide

## Overview
This guide explains how to seed the database with sample data for development and testing.

---

## What Gets Seeded?

The seed script (`prisma/seed.ts`) creates:

| Resource | Count | Details |
|----------|-------|---------|
| Academic Years | 2 | 2024-2025, 2025-2026 (current) |
| Grades | 3 | Khối 10, 11, 12 |
| Subjects | 10 | Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, GDCD, TD |
| Users | 6 | 1 admin + 5 teachers |
| Parents | 8 | Sample parent data |
| Students | 12 | 8 in grade 10, 4 in grade 11 |
| Classes | 5 | 10A1, 10A2, 11A1, 11A2, 12A1 |
| Enrollments | 12 | Students enrolled in classes |
| Scores | 36 | Sample scores for 10A1 students |

---

## How to Run

### Method 1: Using npm script (Recommended)
```bash
npm run seed
```

### Method 2: Direct execution
```bash
npx ts-node prisma/seed.ts
```

### Method 3: Reset + Seed
```bash
# WARNING: This will delete all data!
npx prisma migrate reset
# Then seed will run automatically
```

---

## Login Credentials

### Admin Account
```
Username: admin
Password: admin123
Roles: ADMIN, IT_ADMIN
```

### Teacher Accounts
```
Username: teacher1, teacher2, teacher3, teacher4, teacher5
Password: password123
Role: TEACHER
```

---

## Sample Data Details

### Students
- **HS001-HS008:** Grade 10 students (born 2008)
- **HS009-HS012:** Grade 11 students (born 2007)

### Classes
- **10A1:** 4 students (HS001-HS004), Teacher: Nguyễn Văn An
- **10A2:** 4 students (HS005-HS008), Teacher: Trần Thị Bình
- **11A1:** 2 students (HS009-HS010), Teacher: Lê Văn Cường
- **11A2:** 2 students (HS011-HS012), Teacher: Phạm Thị Dung
- **12A1:** 0 students, Teacher: Hoàng Văn Em

### Scores
- Created for first 4 students in 10A1
- Subjects: Toán, Văn, Anh
- Types: REGULAR, MIDTERM, FINAL
- Values: Random 7-10

---

## Troubleshooting

### Error: "Unique constraint failed"
**Cause:** Data already exists  
**Solution:** 
```bash
# Option 1: Reset database
npx prisma migrate reset

# Option 2: Delete specific records manually
# Then run seed again
```

### Error: "Foreign key constraint failed"
**Cause:** Referenced data doesn't exist  
**Solution:** Ensure migrations are up to date
```bash
npx prisma migrate dev
```

### Error: "Cannot find module"
**Cause:** Dependencies not installed  
**Solution:**
```bash
npm install
```

---

## Customizing Seed Data

Edit `prisma/seed.ts` to customize:

### Add More Students
```typescript
const studentsData = [
  // ... existing students
  { 
    code: 'HS013', 
    name: 'Your Name', 
    dob: '2008-01-01', 
    gender: 'Nam', 
    parentId: parents[0].id 
  },
];
```

### Add More Subjects
```typescript
const subjectsData = [
  // ... existing subjects
  { code: 'TIN', name: 'Tin học' },
];
```

### Change Score Range
```typescript
value: Math.floor(Math.random() * 4) + 7, // 7-10
// Change to:
value: Math.floor(Math.random() * 6) + 5, // 5-10
```

---

## Best Practices

1. **Development:** Run seed after fresh migrations
2. **Testing:** Use seed data for API testing
3. **Production:** DO NOT run seed in production!
4. **Backup:** Always backup before resetting

---

## Next Steps

After seeding:
1. ✅ Verify data in database
2. ✅ Test login with admin credentials
3. ✅ Test API endpoints with seeded data
4. ✅ Start frontend development
