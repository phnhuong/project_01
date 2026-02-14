import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import prisma from '../config/prisma';

export class AuthService {
    async login(username: string, password: string): Promise<{ user: User; token: string } | null> {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, fullName: user.fullName, systemRoles: user.systemRoles },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn as any }
        );

        return { user, token };
    }
}
