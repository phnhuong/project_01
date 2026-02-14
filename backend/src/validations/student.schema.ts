import { z } from 'zod';

/**
 * STUDENT SCHEMAS
 */
export const createStudentSchema = z.object({
    body: z.object({
        studentCode: z.string().min(1, 'Student code is required'),
        fullName: z.string().min(1, 'Full name is required'),
        dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        gender: z.enum(['Nam', 'Nữ', 'Khác']),
        parentId: z.number().int().optional(),
    }),
});

export const updateStudentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Student ID format'),
    }),
    body: z.object({
        studentCode: z.string().optional(),
        fullName: z.string().optional(),
        dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        gender: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
        parentId: z.number().int().optional(),
        isDeleted: z.boolean().optional(),
    }),
});

/**
 * PARENT SCHEMAS
 */
export const createParentSchema = z.object({
    body: z.object({
        fullName: z.string().min(1, 'Full name is required'),
        phone: z.string().min(10, 'Phone must be at least 10 characters'),
    }),
});

export const updateParentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Parent ID format'),
    }),
    body: z.object({
        fullName: z.string().optional(),
        phone: z.string().min(10).optional(),
    }),
});
