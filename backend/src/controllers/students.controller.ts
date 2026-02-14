import { Request, Response } from 'express';
import { StudentsService } from '../services/students.service';

const studentsService = new StudentsService();

export class StudentsController {
    // 1. Get List (Pagination & Search)
    async getStudents(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const search = req.query.search as string;

            const result = await studentsService.getAllStudents(page, limit, search);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Detail
    async getStudent(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const student = await studentsService.getStudentById(id);
            if (!student) {
                res.status(404).json({ message: 'Student not found' });
                return;
            }
            res.json(student);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Create
    async createStudent(req: Request, res: Response) {
        try {
            // Validate required fields
            if (!req.body.studentCode || !req.body.fullName || !req.body.dob || !req.body.gender) {
                res.status(400).json({ message: 'Missing required fields (studentCode, fullName, dob, gender)' });
                return;
            }

            const newStudent = await studentsService.createStudent(req.body);
            res.status(201).json(newStudent);
        } catch (error: any) {
            console.error(error);
            if (error.message === 'Student code already exists' || error.code === 'P2002') {
                res.status(409).json({ message: 'Student code already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Update
    async updateStudent(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedStudent = await studentsService.updateStudent(id, req.body);
            res.json(updatedStudent);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Student not found' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Delete
    async deleteStudent(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await studentsService.deleteStudent(id);
            res.json({ message: 'Student deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Student not found' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
