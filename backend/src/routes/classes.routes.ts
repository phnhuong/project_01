import { Router } from 'express';
import { ClassesController } from '../controllers/classes.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createClassSchema, updateClassSchema, enrollmentSchema } from '../validations/class-score.schema';

const router = Router();
const classesController = new ClassesController();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         gradeId:
 *           type: integer
 *         academicYearId:
 *           type: integer
 *         homeroomTeacherId:
 *           type: integer
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: gradeId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: academicYearId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of classes
 */
router.get('/', classesController.getClasses.bind(classesController));

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class found
 *       404:
 *         description: Class not found
 */
router.get('/:id', classesController.getClass.bind(classesController));

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       201:
 *         description: Class created
 */
router.post('/', validate(createClassSchema), classesController.createClass.bind(classesController));

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Class updated
 */
router.put('/:id', validate(updateClassSchema), classesController.updateClass.bind(classesController));

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted
 */
router.delete('/:id', classesController.deleteClass.bind(classesController));

/**
 * @swagger
 * /api/classes/{id}/students:
 *   post:
 *     summary: Enroll a student into a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Student enrolled
 *       409:
 *         description: Student already enrolled
 */
router.post('/:id/students', validate(enrollmentSchema), classesController.enrollStudent.bind(classesController));

/**
 * @swagger
 * /api/classes/{id}/students/{studentId}:
 *   delete:
 *     summary: Remove a student from a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student removed
 */
router.delete('/:id/students/:studentId', classesController.removeStudent.bind(classesController));

export default router;
