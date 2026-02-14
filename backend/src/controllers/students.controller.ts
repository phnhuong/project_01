import { Request, Response } from 'express';
import { StudentsService } from '../services/students.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const studentsService = new StudentsService();

export class StudentsController {
    // 1. Get List (Pagination & Search)
    getStudents = asyncHandler(async (req: Request, res: Response) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const search = req.query.search as string;

        const result = await studentsService.getAllStudents(page, limit, search);
        res.json(result);
    });

    // 2. Get Detail
    getStudent = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const student = await studentsService.getStudentById(id);
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }
        res.json(student);
    });

    // 3. Create
    createStudent = asyncHandler(async (req: Request, res: Response) => {
        const newStudent = await studentsService.createStudent(req.body);
        res.status(201).json(newStudent);
    });

    // 4. Update
    updateStudent = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists first for consistent error handling
        const existing = await studentsService.getStudentById(id);
        if (!existing) {
            throw new ApiError(404, 'Student not found');
        }
        const result = await studentsService.updateStudent(id, req.body);
        res.json(result);
    });

    // 5. Delete
    deleteStudent = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists first
        const existing = await studentsService.getStudentById(id);
        if (!existing) {
            throw new ApiError(404, 'Student not found');
        }
        await studentsService.deleteStudent(id);
        res.json({ message: 'Student deleted successfully' });
    });
}
