import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // 1. ACADEMIC YEARS
  // ============================================
  console.log('📅 Creating Academic Years...');
  const academicYear2024 = await prisma.academicYear.upsert({
    where: { name: 'Năm học 2024-2025' },
    update: {},
    create: {
      name: 'Năm học 2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      isCurrent: false,
    },
  });

  const academicYear2025 = await prisma.academicYear.upsert({
    where: { name: 'Năm học 2025-2026' },
    update: {},
    create: {
      name: 'Năm học 2025-2026',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-06-30'),
      isCurrent: true,
    },
  });
  console.log('✅ Academic Years created\n');

  // ============================================
  // 2. GRADES (Khối 10, 11, 12)
  // ============================================
  console.log('📚 Creating Grades...');
  const grades = [];
  for (const level of [10, 11, 12]) {
    const grade = await prisma.grade.upsert({
      where: { name: `Khối ${level}` },
      update: {},
      create: { name: `Khối ${level}`, level },
    });
    grades.push(grade);
  }
  console.log('✅ Grades created\n');

  // ============================================
  // 3. SUBJECTS
  // ============================================
  console.log('📖 Creating Subjects...');
  const subjectsData = [
    { code: 'TOAN', name: 'Toán học' },
    { code: 'VAN', name: 'Ngữ văn' },
    { code: 'ANH', name: 'Tiếng Anh' },
    { code: 'LY', name: 'Vật lý' },
    { code: 'HOA', name: 'Hóa học' },
    { code: 'SINH', name: 'Sinh học' },
    { code: 'SU', name: 'Lịch sử' },
    { code: 'DIA', name: 'Địa lý' },
    { code: 'GDCD', name: 'Giáo dục công dân' },
    { code: 'TD', name: 'Thể dục' },
  ];

  const subjects = [];
  for (const sub of subjectsData) {
    const subject = await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: sub,
    });
    subjects.push(subject);
  }
  console.log('✅ Subjects created\n');

  // ============================================
  // 4. USERS (Teachers & Admin)
  // ============================================
  console.log('👥 Creating Users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Quản trị viên',
      systemRoles: ['ADMIN', 'IT_ADMIN'],
    },
  });

  // Teachers
  const teachers = [];
  const teacherNames = [
    'Nguyễn Văn An',
    'Trần Thị Bình',
    'Lê Văn Cường',
    'Phạm Thị Dung',
    'Hoàng Văn Em',
  ];

  for (let i = 0; i < teacherNames.length; i++) {
    const teacher = await prisma.user.upsert({
      where: { username: `teacher${i + 1}` },
      update: {},
      create: {
        username: `teacher${i + 1}`,
        password: hashedPassword,
        fullName: teacherNames[i],
        systemRoles: ['TEACHER'],
      },
    });
    teachers.push(teacher);
  }
  console.log('✅ Users created\n');

  // ============================================
  // 5. PARENTS
  // ============================================
  console.log('👨‍👩‍👧 Creating Parents...');
  const parentsData = [
    { fullName: 'Nguyễn Văn A', phone: '0901234567' },
    { fullName: 'Trần Thị B', phone: '0902345678' },
    { fullName: 'Lê Văn C', phone: '0903456789' },
    { fullName: 'Phạm Thị D', phone: '0904567890' },
    { fullName: 'Hoàng Văn E', phone: '0905678901' },
    { fullName: 'Vũ Thị F', phone: '0906789012' },
    { fullName: 'Đặng Văn G', phone: '0907890123' },
    { fullName: 'Bùi Thị H', phone: '0908901234' },
  ];

  const parents = [];
  for (const parentData of parentsData) {
    const parent = await prisma.parent.upsert({
      where: { phone: parentData.phone },
      update: {},
      create: parentData,
    });
    parents.push(parent);
  }
  console.log('✅ Parents created\n');

  // ============================================
  // 6. STUDENTS
  // ============================================
  console.log('👨‍🎓 Creating Students...');
  const studentsData = [
    { code: 'HS001', name: 'Nguyễn Văn Anh', dob: '2008-01-15', gender: 'Nam', parentId: parents[0].id },
    { code: 'HS002', name: 'Trần Thị Bảo', dob: '2008-02-20', gender: 'Nữ', parentId: parents[1].id },
    { code: 'HS003', name: 'Lê Văn Cường', dob: '2008-03-10', gender: 'Nam', parentId: parents[2].id },
    { code: 'HS004', name: 'Phạm Thị Duyên', dob: '2008-04-25', gender: 'Nữ', parentId: parents[3].id },
    { code: 'HS005', name: 'Hoàng Văn Em', dob: '2008-05-30', gender: 'Nam', parentId: parents[4].id },
    { code: 'HS006', name: 'Vũ Thị Phương', dob: '2008-06-12', gender: 'Nữ', parentId: parents[5].id },
    { code: 'HS007', name: 'Đặng Văn Giang', dob: '2008-07-18', gender: 'Nam', parentId: parents[6].id },
    { code: 'HS008', name: 'Bùi Thị Hà', dob: '2008-08-22', gender: 'Nữ', parentId: parents[7].id },
    { code: 'HS009', name: 'Ngô Văn Ích', dob: '2007-01-05', gender: 'Nam', parentId: parents[0].id },
    { code: 'HS010', name: 'Trịnh Thị Kim', dob: '2007-02-14', gender: 'Nữ', parentId: parents[1].id },
    { code: 'HS011', name: 'Phan Văn Long', dob: '2007-03-20', gender: 'Nam', parentId: parents[2].id },
    { code: 'HS012', name: 'Đỗ Thị Mai', dob: '2007-04-08', gender: 'Nữ', parentId: parents[3].id },
  ];

  const students = [];
  for (const student of studentsData) {
    const created = await prisma.student.upsert({
      where: { studentCode: student.code },
      update: {},
      create: {
        studentCode: student.code,
        fullName: student.name,
        dob: new Date(student.dob),
        gender: student.gender,
        parentId: student.parentId,
      },
    });
    students.push(created);
  }
  console.log('✅ Students created\n');

  // ============================================
  // 7. CLASSES
  // ============================================
  console.log('🏫 Creating Classes...');
  const classesData = [
    { name: '10A1', gradeId: grades[0].id, academicYearId: academicYear2025.id, teacherId: teachers[0].id },
    { name: '10A2', gradeId: grades[0].id, academicYearId: academicYear2025.id, teacherId: teachers[1].id },
    { name: '11A1', gradeId: grades[1].id, academicYearId: academicYear2025.id, teacherId: teachers[2].id },
    { name: '11A2', gradeId: grades[1].id, academicYearId: academicYear2025.id, teacherId: teachers[3].id },
    { name: '12A1', gradeId: grades[2].id, academicYearId: academicYear2025.id, teacherId: teachers[4].id },
  ];

  const classes = [];
  for (const classData of classesData) {
    const createdClass = await prisma.class.upsert({
      where: {
        name_academicYearId: {
          name: classData.name,
          academicYearId: classData.academicYearId
        }
      },
      update: {},
      create: {
        name: classData.name,
        gradeId: classData.gradeId,
        academicYearId: classData.academicYearId,
        homeroomTeacherId: classData.teacherId,
      },
    });
    classes.push(createdClass);
  }
  console.log('✅ Classes created\n');

  // ============================================
  // 8. CLASS ENROLLMENTS
  // ============================================
  console.log('📝 Creating Class Enrollments...');
  // Enroll students to classes
  // 10A1: students 0-3
  // 10A2: students 4-7
  // 11A1: students 8-9
  // 11A2: students 10-11
  const enrollments = [
    { classId: classes[0].id, studentId: students[0].id },
    { classId: classes[0].id, studentId: students[1].id },
    { classId: classes[0].id, studentId: students[2].id },
    { classId: classes[0].id, studentId: students[3].id },
    { classId: classes[1].id, studentId: students[4].id },
    { classId: classes[1].id, studentId: students[5].id },
    { classId: classes[1].id, studentId: students[6].id },
    { classId: classes[1].id, studentId: students[7].id },
    { classId: classes[2].id, studentId: students[8].id },
    { classId: classes[2].id, studentId: students[9].id },
    { classId: classes[3].id, studentId: students[10].id },
    { classId: classes[3].id, studentId: students[11].id },
  ];

  for (const enrollment of enrollments) {
    await prisma.classEnrollment.upsert({
      where: {
        studentId_classId: {
          studentId: enrollment.studentId,
          classId: enrollment.classId
        }
      },
      update: {},
      create: enrollment,
    });
  }
  console.log('✅ Enrollments created\n');

  // ============================================
  // 9. SCORES
  // ============================================
  console.log('📊 Creating Scores...');
  // Create sample scores for students in 10A1
  const scoreTypes = ['REGULAR', 'MIDTERM', 'FINAL'];
  let scoreCount = 0;

  // Get enrollments for 10A1 (first 4 students)
  const class10A1Enrollments = await prisma.classEnrollment.findMany({
    where: { classId: classes[0].id },
    take: 4
  });

  for (const enrollment of class10A1Enrollments) {
    for (let j = 0; j < 3; j++) { // First 3 subjects (Toán, Văn, Anh)
      for (const scoreType of scoreTypes) {
        await prisma.score.create({
          data: {
            enrollmentId: enrollment.id,
            subjectId: subjects[j].id,
            type: scoreType,
            value: Math.floor(Math.random() * 4) + 7, // Random score 7-10
            semester: 1,
          },
        });
        scoreCount++;
      }
    }
  }
  console.log('✅ Scores created\n');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('═══════════════════════════════════════');
  console.log('✅ Seeding completed successfully!');
  console.log('═══════════════════════════════════════');
  console.log(`📅 Academic Years: 2`);
  console.log(`📚 Grades: ${grades.length}`);
  console.log(`📖 Subjects: ${subjects.length}`);
  console.log(`👥 Users: ${teachers.length + 1} (${teachers.length} teachers + 1 admin)`);
  console.log(`👨‍👩‍👧 Parents: ${parents.length}`);
  console.log(`👨‍🎓 Students: ${students.length}`);
  console.log(`🏫 Classes: ${classes.length}`);
  console.log(`📝 Enrollments: ${enrollments.length}`);
  console.log(`📊 Scores: ${scoreCount}`);
  console.log('═══════════════════════════════════════\n');

  console.log('🔑 Login credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('\n   Teachers: teacher1-5');
  console.log('   Password: password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
