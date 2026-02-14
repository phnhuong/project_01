# Seed Data - Status Report

## Status: ⚠️ DATABASE CONNECTION ISSUE

---

## What Was Created

### ✅ Seed Script (`prisma/seed.ts`)
Comprehensive seed script with sample data for all modules:

| Module | Sample Data Count |
|--------|------------------|
| Academic Years | 2 (2024-2025, 2025-2026) |
| Grades | 3 (Khối 10, 11, 12) |
| Subjects | 10 (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa, GDCD, TD) |
| Users | 6 (1 admin + 5 teachers) |
| Parents | 8 parents |
| Students | 12 students |
| Classes | 5 classes (10A1, 10A2, 11A1, 11A2, 12A1) |
| Enrollments | 12 student enrollments |
| Scores | 36 sample scores |

### ✅ Scripts Added
- `npm run seed` - Command to run seed script
- `prisma.seed` configuration in package.json

### ✅ Documentation
- `SEEDING_GUIDE.md` - Complete seeding guide

---

## Current Issue

### Error: P1008 - Socket Timeout
```
Operation has timed out
DriverAdapterError: SocketTimeout
```

**Cause:** Database server not responding or connection issue

---

## Resolution Steps

### Step 1: Check Database Server
```bash
# On Ubuntu VM
sudo systemctl status postgresql
```

**Expected:** Service should be `active (running)`

**If not running:**
```bash
sudo systemctl start postgresql
```

### Step 2: Check Database Connection
```bash
# Test connection from Windows
psql -h 192.168.1.100 -U student_admin -d student_management_uat
```

**If connection fails:**
- Check firewall rules on Ubuntu
- Check PostgreSQL `pg_hba.conf` settings
- Verify IP address in `.env` file

### Step 3: Check `.env` File
```
DATABASE_URL="postgresql://student_admin:password@192.168.1.100:5432/student_management_uat?schema=public"
```

Verify:
- ✅ Username correct
- ✅ Password correct
- ✅ IP address correct
- ✅ Port 5432 open
- ✅ Database name correct

### Step 4: Alternative - Run Seed on Ubuntu
```bash
# SSH to Ubuntu VM
cd /path/to/backend
npm run seed
```

This avoids network issues between Windows and Ubuntu.

---

## Quick Fix Checklist

- [ ] PostgreSQL service running on Ubuntu
- [ ] Port 5432 accessible from Windows
- [ ] Firewall allows connection
- [ ] `.env` DATABASE_URL is correct
- [ ] Can connect with `psql` command

---

## Alternative: Manual Seed

If automated seed fails, you can manually create data:

### 1. Login as Admin
```http
POST /api/auth/login
{"username":"admin","password":"admin123"}
```

### 2. Create Data via API
Use Postman with test data from `docs/testing/QUICK_REFERENCE.md`

---

## Next Steps

1. **Fix database connection** using steps above
2. **Run seed again:**
   ```bash
   npm run seed
   ```
3. **Verify data:**
   ```bash
   # Check record counts
   SELECT 'users' as table, COUNT(*) FROM users
   UNION ALL
   SELECT 'students', COUNT(*) FROM students
   UNION ALL
   SELECT 'classes', COUNT(*) FROM classes;
   ```

---

## Login Credentials (After Successful Seed)

**Admin:**
- Username: `admin`
- Password: `admin123`

**Teachers:**
- Username: `teacher1` to `teacher5`
- Password: `password123`

---

## Files Created

- ✅ `prisma/seed.ts` - Seed script
- ✅ `package.json` - Added seed command
- ✅ `SEEDING_GUIDE.md` - Documentation
- ✅ `docs/testing/` - Complete testing docs (3 files)

**All code is ready, just need database connection!**
