import { z } from 'zod';

/**
 * AUTH SCHEMAS
 */
export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
    }),
});

/**
 * USER SCHEMAS
 */
export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        fullName: z.string().min(1, 'Full name is required'),
        systemRoles: z.array(z.enum(['ADMIN', 'TEACHER', 'PARENT'])).optional(),
        isActive: z.boolean().optional(),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid User ID format'),
    }),
    body: z.object({
        username: z.string().min(3).optional(),
        password: z.string().min(6).optional(),
        fullName: z.string().min(1).optional(),
        systemRoles: z.array(z.enum(['ADMIN', 'TEACHER', 'PARENT'])).optional(),
        isActive: z.boolean().optional(),
    }),
});
