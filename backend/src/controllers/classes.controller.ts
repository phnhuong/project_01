import { Request, Response } from 'express';
import { ClassesService } from '../services/classes.service';

const classesService = new ClassesService();

export class ClassesController {
    // 1. Get All (with optional filters)
    async getClasses(req: Request, res: Response) {
        try {
            const academicYearId = req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined;
            const gradeId = req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined;

            const classes = await classesService.getAllClasses(academicYearId, gradeId);
            res.json(classes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Detail (with students)
    async getClass(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const classData = await classesService.getClassById(id);
            if (!classData) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }
            res.json(classData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Create
    async createClass(req: Request, res: Response) {
        try {
            if (!req.body.name || !req.body.gradeId || !req.body.academicYearId) {
                res.status(400).json({ message: 'Missing required fields (name, gradeId, academicYearId)' });
                return;
            }

            const newClass = await classesService.createClass(req.body);
            res.status(201).json(newClass);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2003') {
                res.status(400).json({ message: 'Invalid gradeId, academicYearId, or homeroomTeacherId' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Update
    async updateClass(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedClass = await classesService.updateClass(id, req.body);
            res.json(updatedClass);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Class not found' });
                return;
            }
            if (error.code === 'P2003') {
                res.status(400).json({ message: 'Invalid gradeId, academicYearId, or homeroomTeacherId' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Delete
    async deleteClass(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await classesService.deleteClass(id);
            res.json({ message: 'Class deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Class not found' });
                return;
            }
            if (error.message === 'Cannot delete class with existing enrollments or scores') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 6. Enroll Student
    async enrollStudent(req: Request, res: Response) {
        try {
            const classId = parseInt(req.params.id as string);
            const { studentId } = req.body;

            if (isNaN(classId) || !studentId) {
                res.status(400).json({ message: 'Invalid classId or studentId' });
                return;
            }

            const enrollment = await classesService.enrollStudent(classId, studentId);
            res.status(201).json(enrollment);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Student already enrolled in this class' });
                return;
            }
            if (error.code === 'P2003') {
                res.status(400).json({ message: 'Invalid classId or studentId' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 7. Remove Student
    async removeStudent(req: Request, res: Response) {
        try {
            const classId = parseInt(req.params.id as string);
            const studentId = parseInt(req.params.studentId as string);

            if (isNaN(classId) || isNaN(studentId)) {
                res.status(400).json({ message: 'Invalid classId or studentId' });
                return;
            }

            await classesService.removeStudent(classId, studentId);
            res.json({ message: 'Student removed from class successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
