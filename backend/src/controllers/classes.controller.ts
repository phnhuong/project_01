import { Request, Response } from 'express';
import { ClassesService } from '../services/classes.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const classesService = new ClassesService();

export class ClassesController {
    // 1. Get All (with optional filters)
    getClasses = asyncHandler(async (req: Request, res: Response) => {
        const academicYearId = req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined;
        const gradeId = req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined;

        const classes = await classesService.getAllClasses(academicYearId, gradeId);
        res.json(classes);
    });

    // 2. Get Detail (with students)
    getClass = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const classData = await classesService.getClassById(id);
        if (!classData) {
            throw new ApiError(404, 'Class not found');
        }
        res.json(classData);
    });

    // 3. Create
    createClass = asyncHandler(async (req: Request, res: Response) => {
        const newClass = await classesService.createClass(req.body);
        res.status(201).json(newClass);
    });

    // 4. Update
    updateClass = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await classesService.getClassById(id);
        if (!existing) {
            throw new ApiError(404, 'Class not found');
        }
        const updatedClass = await classesService.updateClass(id, req.body);
        res.json(updatedClass);
    });

    // 5. Delete
    deleteClass = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await classesService.getClassById(id);
        if (!existing) {
            throw new ApiError(404, 'Class not found');
        }
        await classesService.deleteClass(id);
        res.json({ message: 'Class deleted successfully' });
    });

    // 6. Enroll Student
    enrollStudent = asyncHandler(async (req: Request, res: Response) => {
        const classId = parseInt(req.params.id as string);
        const { studentId } = req.body;

        const enrollment = await classesService.enrollStudent(classId, studentId);
        res.status(201).json(enrollment);
    });

    // 7. Remove Student
    removeStudent = asyncHandler(async (req: Request, res: Response) => {
        const classId = parseInt(req.params.id as string);
        const studentId = parseInt(req.params.studentId as string);

        await classesService.removeStudent(classId, studentId);
        res.json({ message: 'Student removed from class successfully' });
    });
}
