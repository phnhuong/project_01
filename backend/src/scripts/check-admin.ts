import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// Override DATABASE_URL to test IP connection
process.env.DATABASE_URL = "postgresql://app_user:secure_db_pass@192.168.147.3:5432/student_management_test?schema=public";

console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function checkAdmin() {
    console.log('Starting admin check...');
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'admin' },
        });

        console.log('Admin user found:', user ? 'YES' : 'NO');

        if (user) {
            console.log('User details:', { ...user, password: '[REDACTED]' });
            const isMatch = await bcrypt.compare('admin123', user.password);
            console.log('Password "admin123" match:', isMatch ? 'YES' : 'NO');

            if (!isMatch) {
                console.log('Generating new hash for "admin123"...');
                const newHash = await bcrypt.hash('admin123', 10);
                console.log('New hash verification:', await bcrypt.compare('admin123', newHash));
            }
        } else {
            console.log('Admin user DOES NOT EXIST.');
        }
    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
