import express from 'express';
import {
    getAllDefinitions,
    getActiveDefinition,
    createDefinition
} from '../controllers/definitionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/Sensors/definitions:
 *   get:
 *     summary: Lấy danh sách tất cả các cấu trúc (Definitions).
 *     tags: [Definitions]
 *     responses:
 *       200:
 *         description: Trả về mảng các Definitions.
 */
router.get('/definitions', getAllDefinitions);

/**
 * @swagger
 * /api/Sensors/definitions/active:
 *   get:
 *     summary: Lấy cấu trúc Definition hiện đang hoạt động (active).
 *     tags: [Definitions]
 *     responses:
 *       200:
 *         description: Trả về object Definition active.
 *       404:
 *         description: No active definition found.
 */
router.get('/definitions/active', getActiveDefinition);

/**
 * @swagger
 * /api/Sensors/definitions:
 *   post:
 *     summary: Tạo mới máy Trạm (Definition) (Yêu cầu JWT).
 *     tags: [Definitions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Tạo mới thành công.
 */
router.post('/definitions', protect, createDefinition);

export default router;
