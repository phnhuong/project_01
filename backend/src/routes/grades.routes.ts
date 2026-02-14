import { Router } from 'express';
import { GradesController } from '../controllers/grades.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createGradeSchema, updateGradeSchema } from '../validations/education.schema';

const router = Router();
const gradesController = new GradesController();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Grade:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         level:
 *           type: integer
 */

/**
 * @swagger
 * /api/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of grades
 */
router.get('/', gradesController.getGrades.bind(gradesController));

/**
 * @swagger
 * /api/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Grades]
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
 *         description: Grade found
 */
router.get('/:id', gradesController.getGrade.bind(gradesController));

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Create a new grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       201:
 *         description: Grade created
 *       400:
 *         description: Validation failed
 */
router.post('/', validate(createGradeSchema), gradesController.createGrade.bind(gradesController));

/**
 * @swagger
 * /api/grades/{id}:
 *   put:
 *     summary: Update a grade
 *     tags: [Grades]
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
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       200:
 *         description: Grade updated
 *       400:
 *         description: Validation failed
 */
router.put('/:id', validate(updateGradeSchema), gradesController.updateGrade.bind(gradesController));

/**
 * @swagger
 * /api/grades/{id}:
 *   delete:
 *     summary: Delete a grade
 *     tags: [Grades]
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
 *         description: Grade deleted
 */
router.delete('/:id', gradesController.deleteGrade.bind(gradesController));

export default router;
