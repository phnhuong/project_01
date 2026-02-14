import { z } from 'zod';

/**
 * CLASS SCHEMAS
 */
export const createClassSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Class name is required'),
        gradeId: z.number().int(),
        academicYearId: z.number().int(),
        homeroomTeacherId: z.number().int().optional(),
    }),
});

export const updateClassSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Class ID format'),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        gradeId: z.number().int().optional(),
        academicYearId: z.number().int().optional(),
        homeroomTeacherId: z.number().int().optional(),
    }),
});

export const enrollmentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Class ID format'),
    }),
    body: z.object({
        studentId: z.number().int(),
    }),
});

/**
 * SCORE SCHEMAS
 */
export const createScoreSchema = z.object({
    body: z.object({
        studentId: z.number().int(),
        subjectId: z.number().int(),
        classId: z.number().int(),
        scoreType: z.enum(['REGULAR', 'MIDTERM', 'FINAL']),
        value: z.number().min(0, 'Score must be at least 0').max(10, 'Score cannot exceed 10'),
        semester: z.number().int().min(1).max(2).optional(),
    }),
});

export const updateScoreSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Invalid Score ID format'),
    }),
    body: z.object({
        scoreType: z.enum(['REGULAR', 'MIDTERM', 'FINAL']).optional(),
        value: z.number().min(0).max(10).optional(),
        semester: z.number().int().min(1).max(2).optional(),
    }),
});
