import express from 'express';
import genericController from '../controllers/genericController.js';
import { getActiveDefinition } from '../controllers/definitionController.js';
import { Definition } from '../models/Definition.js';
import { protect, adminOnly } from '../middleware/auth.js';

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
router.get('/definitions', genericController.getAll(Definition));

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
 *     summary: Tạo mới máy Trạm (Definition) (Yêu cầu Admin).
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
 *       403:
 *         description: Access denied. Admin only.
 */
router.post('/definitions', protect, adminOnly, genericController.create(Definition));

export default router;
