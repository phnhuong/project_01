import { Router } from 'express';
import { ParentsController } from '../controllers/parents.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createParentSchema, updateParentSchema } from '../validations/student.schema';

const router = Router();
const parentsController = new ParentsController();

router.use(authenticateToken as any);

/**
 * @swagger
 * tags:
 *   name: Parents
 *   description: Parent management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Parent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /api/parents:
 *   get:
 *     summary: Get all parents
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of parents
 */
router.get('/', parentsController.getParents.bind(parentsController));

/**
 * @swagger
 * /api/parents/{id}:
 *   get:
 *     summary: Get parent by ID
 *     tags: [Parents]
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
 *         description: Parent found
 */
router.get('/:id', parentsController.getParent.bind(parentsController));

/**
 * @swagger
 * /api/parents:
 *   post:
 *     summary: Create a new parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parent'
 *     responses:
 *       201:
 *         description: Parent created
 *       400:
 *         description: Validation failed
 */
router.post('/', validate(createParentSchema), parentsController.createParent.bind(parentsController));

/**
 * @swagger
 * /api/parents/{id}:
 *   put:
 *     summary: Update a parent
 *     tags: [Parents]
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
 *             $ref: '#/components/schemas/Parent'
 *     responses:
 *       200:
 *         description: Parent updated
 *       400:
 *         description: Validation failed
 */
router.put('/:id', validate(updateParentSchema), parentsController.updateParent.bind(parentsController));

/**
 * @swagger
 * /api/parents/{id}:
 *   delete:
 *     summary: Delete a parent
 *     tags: [Parents]
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
 *         description: Parent deleted
 */
router.delete('/:id', parentsController.deleteParent.bind(parentsController));

export default router;
