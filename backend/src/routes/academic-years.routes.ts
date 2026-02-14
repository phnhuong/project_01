import { Router } from 'express';
import { AcademicYearsController } from '../controllers/academic-years.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAcademicYearSchema, updateAcademicYearSchema } from '../validations/education.schema';

const router = Router();
const academicYearsController = new AcademicYearsController();

// Apply authentication middleware
router.use(authenticateToken as any);

/**
 * @swagger
 * tags:
 *   name: AcademicYears
 *   description: Academic year management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicYear:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isCurrent:
 *           type: boolean
 */

/**
 * @swagger
 * /api/academic-years/active:
 *   get:
 *     summary: Get the current active academic year
 *     tags: [AcademicYears]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active year found
 */
router.get('/active', academicYearsController.getActiveAcademicYear.bind(academicYearsController));

/**
 * @swagger
 * /api/academic-years:
 *   get:
 *     summary: Get all academic years
 *     tags: [AcademicYears]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of academic years
 */
router.get('/', academicYearsController.getAcademicYears.bind(academicYearsController));

/**
 * @swagger
 * /api/academic-years/{id}:
 *   get:
 *     summary: Get academic year by ID
 *     tags: [AcademicYears]
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
 *         description: Year found
 */
router.get('/:id', academicYearsController.getAcademicYear.bind(academicYearsController));

/**
 * @swagger
 * /api/academic-years:
 *   post:
 *     summary: Create a new academic year
 *     tags: [AcademicYears]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       201:
 *         description: Year created
 *       400:
 *         description: Validation failed
 */
router.post('/', validate(createAcademicYearSchema), academicYearsController.createAcademicYear.bind(academicYearsController));

/**
 * @swagger
 * /api/academic-years/{id}:
 *   put:
 *     summary: Update an academic year
 *     tags: [AcademicYears]
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
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       200:
 *         description: Year updated
 *       400:
 *         description: Validation failed
 */
router.put('/:id', validate(updateAcademicYearSchema), academicYearsController.updateAcademicYear.bind(academicYearsController));

/**
 * @swagger
 * /api/academic-years/{id}:
 *   delete:
 *     summary: Delete an academic year
 *     tags: [AcademicYears]
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
 *         description: Year deleted
 */
router.delete('/:id', academicYearsController.deleteAcademicYear.bind(academicYearsController));

export default router;
