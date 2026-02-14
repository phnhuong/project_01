import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

console.log("DB URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");

try {
    const prisma = new PrismaClient();
    console.log("Client initialized");
    prisma.$connect().then(() => {
        console.log("Connected");
        prisma.$disconnect();
    }).catch(e => console.error("Connect error", e));
} catch (e) {
    console.error("Init error", e);
}
