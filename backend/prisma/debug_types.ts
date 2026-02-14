import { PrismaClient } from '@prisma/client';

const p = new PrismaClient({
    // @ts-expect-error Trigger error to see valid props
    invalidProp: 1
});
