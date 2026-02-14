import { z } from 'zod';

/**
 * ACADEMIC YEAR SCHEMAS
 */
export const createAcademicYearSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
        isCurrent: z.boolean().optional(),
    }),
});

export const updateAcademicYearSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Year ID format'),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        isCurrent: z.boolean().optional(),
    }),
});

/**
 * GRADE SCHEMAS
 */
export const createGradeSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Grade name is required'),
        level: z.number().int().min(1).max(20),
    }),
});

export const updateGradeSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Grade ID format'),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        level: z.number().int().min(1).max(20).optional(),
    }),
});

/**
 * SUBJECT SCHEMAS
 */
export const createSubjectSchema = z.object({
    body: z.object({
        code: z.string().min(1, 'Subject code is required'),
        name: z.string().min(1, 'Subject name is required'),
    }),
});

export const updateSubjectSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Subject ID format'),
    }),
    body: z.object({
        code: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
    }),
});
