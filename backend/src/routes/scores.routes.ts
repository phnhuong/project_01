import { Router } from 'express';
import { ScoresController } from '../controllers/scores.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createScoreSchema, updateScoreSchema } from '../validations/class-score.schema';

const router = Router();
const scoresController = new ScoresController();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Scores
 *   description: Score management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Score:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         studentId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         classId:
 *           type: integer
 *         scoreType:
 *           type: string
 *           enum: [REGULAR, MIDTERM, FINAL]
 *         value:
 *           type: number
 *         semester:
 *           type: integer
 */

/**
 * @swagger
 * /api/scores:
 *   get:
 *     summary: Get all scores
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of scores
 */
router.get('/', scoresController.getScores.bind(scoresController));

/**
 * @swagger
 * /api/scores/{id}:
 *   get:
 *     summary: Get score by ID
 *     tags: [Scores]
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
 *         description: Score found
 */
router.get('/:id', scoresController.getScore.bind(scoresController));

/**
 * @swagger
 * /api/scores:
 *   post:
 *     summary: Create a new score
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Score'
 *     responses:
 *       201:
 *         description: Score created
 *       400:
 *         description: Validation error or not enrolled
 */
router.post('/', validate(createScoreSchema), scoresController.createScore.bind(scoresController));

/**
 * @swagger
 * /api/scores/{id}:
 *   put:
 *     summary: Update a score
 *     tags: [Scores]
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
 *             properties:
 *               scoreType:
 *                 type: string
 *               value:
 *                 type: number
 *               semester:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Score updated
 */
router.put('/:id', validate(updateScoreSchema), scoresController.updateScore.bind(scoresController));

/**
 * @swagger
 * /api/scores/{id}:
 *   delete:
 *     summary: Delete a score
 *     tags: [Scores]
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
 *         description: Score deleted
 */
router.delete('/:id', scoresController.deleteScore.bind(scoresController));

export default router;
