import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- CONSTANTS ---

const ACADEMIC_YEARS = [
    { name: '2023-2024', start: '2023-08-01', end: '2024-07-31', current: false },
    { name: '2024-2025', start: '2024-08-01', end: '2025-07-31', current: false },
    { name: '2025-2026', start: '2024-08-01', end: '2026-07-31', current: true },
];

// Grade Levels 10-12 (to reduce data volume)
const GRADES = [10, 11, 12];

// Standard Subjects (MOET simplified for data model)
const SUBJECTS_PRIMARY = [
    { code: 'TOAN', name: 'Toán học' },
    { code: 'TV', name: 'Tiếng Việt' },
    { code: 'TNXH', name: 'Tự nhiên & Xã hội' },
    { code: 'KH', name: 'Khoa học' },
    { code: 'LS_DL', name: 'Lịch sử & Địa lý' },
    { code: 'TIN', name: 'Tin học & Công nghệ' },
    { code: 'TC', name: 'Giáo dục thể chất' },
    { code: 'NT', name: 'Nghệ thuật' },
    { code: 'DD', name: 'Đạo đức' },
];

const SUBJECTS_SECONDARY = [
    { code: 'TOAN', name: 'Toán học' },
    { code: 'NV', name: 'Ngữ văn' },
    { code: 'KHTN', name: 'Khoa học tự nhiên' },
    { code: 'LS_DL', name: 'Lịch sử & Địa lý' },
    { code: 'GDCD', name: 'Giáo dục công dân' },
    { code: 'TIN', name: 'Tin học' },
    { code: 'CN', name: 'Công nghệ' },
    { code: 'TC', name: 'Giáo dục thể chất' },
    { code: 'NT', name: 'Nghệ thuật' },
];

const SUBJECTS_HIGH = [
    { code: 'TOAN', name: 'Toán học' },
    { code: 'NV', name: 'Ngữ văn' },
    { code: 'LS', name: 'Lịch sử' },
    { code: 'TC', name: 'Giáo dục thể chất' },
    { code: 'QP', name: 'Giáo dục Quốc phòng' },
    { code: 'LY', name: 'Vật lý' },
    { code: 'HOA', name: 'Hóa học' },
    { code: 'SINH', name: 'Sinh học' },
    { code: 'TIN', name: 'Tin học' },
];

const LANGUAGES = [
    { code: 'ANH', name: 'Tiếng Anh' },
    { code: 'PHAP', name: 'Tiếng Pháp' },
];

// Helper to get random int [min, max]
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate Normal Distribution number (Box-Muller transform)
function randn_bm(min: number, max: number, skew: number) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range

    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

// Helper to get random item from array
function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log('🌱 Starting Optimized Advanced Seeding...');
    const start = Date.now();

    // 1. CLEANUP (Use truncate for speed and referential integrity)
    console.log('🧹 Cleaning database...');
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE scores, class_enrollments, teaching_assignments, students, classes, users, subjects, grades, academic_years, parents RESTART IDENTITY CASCADE;`);

    // 2. REFERENCE DATA
    console.log('📅 Seeding Academic Years...');
    const academicYearsMap = new Map();
    for (const year of ACADEMIC_YEARS) {
        const r = await prisma.academicYear.create({
            data: {
                name: year.name,
                startDate: new Date(year.start),
                endDate: new Date(year.end),
                isCurrent: year.current,
            }
        });
        academicYearsMap.set(year.name, r);
    }

    // 3. USERS (TEACHERS)
    console.log('👥 Seeding Users (Teachers)...');

    console.log('📖 Seeding Subjects...');
    // Combine all unique subjects
    const allSubjects = new Map(); // code -> id
    const subjectsToCreate = [
        ...SUBJECTS_PRIMARY,
        ...SUBJECTS_SECONDARY,
        ...SUBJECTS_HIGH,
        ...LANGUAGES
    ];

    // Dedup by code
    const uniqueSubjects = Array.from(new Map(subjectsToCreate.map(item => [item.code, item])).values());

    for (const sub of uniqueSubjects) {
        const r = await prisma.subject.create({
            data: sub
        });
        allSubjects.set(sub.code, r.id);
    }

    // 3. USERS (TEACHERS)
    console.log('👥 Seeding Users (Teachers)...');
    const password = await bcrypt.hash('password123', 10);

    // Admin
    await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
            fullName: 'Quản trị viên',
            systemRoles: ['ADMIN'],
        }
    });

    const teacherData = Array.from({ length: 50 }, (_, i) => ({
        username: `teacher${i + 1}`,
        password,
        fullName: `Giáo viên ${i + 1}`,
        systemRoles: ['TEACHER'],
    }));

    // Create teachers and get IDs
    // Note: createManyAndReturn is available in Prisma v5.14+
    const createdTeachers = await prisma.user.createManyAndReturn({
        data: teacherData,
        select: { id: true }
    });
    const teacherIds = createdTeachers.map(t => t.id);

    // 4. MAIN LOOP: YEARS -> GRADES -> CLASSES
    console.log('🏫 Seeding Classes, Students, and Scores (Batch Mode)...');

    // Create a smaller pool of parents for better performance
    console.log('   Creating Parent Pool...');
    const parentPoolData = Array.from({ length: 300 }, (_, i) => ({
        fullName: `Phụ huynh ${i + 1}`,
        phone: `09${10000000 + i}`,
    }));
    const createdParents = await prisma.parent.createManyAndReturn({
        data: parentPoolData,
        select: { id: true }
    });
    let parentIds = createdParents.map(p => p.id);

    let globalStudentCounter = 1; // Global counter for unique student codes
    const yearsGradesMap = new Map(); // yearId -> { level -> gradeId }

    for (const [yearName, yearObj] of academicYearsMap) {
        console.log(`   Processing ${yearName}...`);

        // Seed Grades for this year
        const levelMap = new Map();
        for (const level of GRADES) {
            const r = await prisma.grade.create({
                data: {
                    name: `Khối ${level}`,
                    level,
                    academicYearId: yearObj.id
                }
            });
            levelMap.set(level, r.id);
        }
        yearsGradesMap.set(yearObj.id, levelMap);

        for (const level of GRADES) {
            // 5-10 classes per grade
            const numClasses = getRandomInt(3, 6); // Reduced from 5-10 to 3-6

            // Determine Subject List for this Grade Level
            let gradeSubjects: { code: string; name: string }[] = [];
            if (level <= 5) gradeSubjects = SUBJECTS_PRIMARY;
            else if (level <= 9) gradeSubjects = SUBJECTS_SECONDARY;
            else gradeSubjects = SUBJECTS_HIGH;

            for (let c = 1; c <= numClasses; c++) {
                const className = `${level}A${c}`;

                // Create Class
                const cls = await prisma.class.create({
                    data: {
                        name: className,
                        gradeId: yearsGradesMap.get(yearObj.id).get(level),
                        academicYearId: yearObj.id,
                        homeroomTeacherId: getRandomItem(teacherIds), // Random homeroom teacher
                    }
                });

                // Assign Subjects (TeachingAssignment)
                // 1. Language Rule: 90% English, 10% French
                const languageCode = Math.random() < 0.9 ? 'ANH' : 'PHAP';
                const classSubjectList = [...gradeSubjects, { code: languageCode, name: languageCode === 'ANH' ? 'Tiếng Anh' : 'Tiếng Pháp' }];

                const assignmentData = classSubjectList
                    .map(sub => {
                        const subId = allSubjects.get(sub.code);
                        return subId ? {
                            classId: cls.id,
                            subjectId: subId,
                            userId: getRandomItem(teacherIds)
                        } : null;
                    })
                    .filter(Boolean) as any[];

                await prisma.teachingAssignment.createMany({ data: assignmentData });

                // Create Students (30-50 per class)
                const numStudents = getRandomInt(30, 50);
                const studentData = [];

                for (let s = 1; s <= numStudents; s++) {
                    // Parent Logic
                    let pid: number;
                    if (Math.random() < 0.03 && parentIds.length > 0) {
                        pid = getRandomItem(parentIds);
                    } else {
                        // To keep it fast, we just pick random from pool for now,
                        // or we'd need to create individual parents which slows down 'createMany'.
                        // Let's stick to the pool for speed in this optimized script.
                        pid = getRandomItem(parentIds);
                    }

                    studentData.push({
                        studentCode: `HS${String(globalStudentCounter).padStart(6, '0')}`, // HS000001, HS000002, etc.
                        fullName: `Học sinh ${level}A${c}-${s}`,
                        dob: new Date(2025 - level - 6, 0, 1), // Approx age
                        gender: Math.random() > 0.5 ? 'Nam' : 'Nữ',
                        parentId: pid,
                    });
                    globalStudentCounter++;
                }

                const createdStudents = await prisma.student.createManyAndReturn({
                    data: studentData,
                    select: { id: true }
                });

                // Enroll
                const enrollmentData = createdStudents.map(st => ({
                    classId: cls.id,
                    studentId: st.id
                }));

                const createdEnrollments = await prisma.classEnrollment.createManyAndReturn({
                    data: enrollmentData,
                    select: { id: true }
                });

                // Generate Scores
                // Past years: Sem 1 & 2. Current year (2025-2026): Sem 1 only.
                const semesters = yearObj.isCurrent ? [1] : [1, 2];

                const scoreTypes = ['KTM', 'KT15', 'KT1T', 'THHK'];
                const scoreData = [];

                for (const enroll of createdEnrollments) {
                    for (const sem of semesters) {
                        for (const sub of classSubjectList) {
                            const subId = allSubjects.get(sub.code);
                            if (!subId) continue;

                            for (const type of scoreTypes) {
                                // Normal distribution around 7.5
                                let val = randn_bm(0, 10, 1.0);
                                // Custom tweaks:
                                // Excellent students: mean 9
                                // Weak students: mean 4
                                // Let's stick to one distribution for now
                                val = Math.round(val * 10) / 10; // 1 decimal

                                scoreData.push({
                                    enrollmentId: enroll.id,
                                    subjectId: subId,
                                    type: type,
                                    value: val,
                                    semester: sem
                                });
                            }
                        }
                    }
                }

                // Batch insert scores
                // PostgreSQL can handle thousands of rows in one insert, but let's chunk if huge
                if (scoreData.length > 0) {
                    await prisma.score.createMany({ data: scoreData });
                }
            }
        }
    }

    const duration = (Date.now() - start) / 1000;
    console.log(`✅ Optimized Seeding completed in ${duration}s`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
