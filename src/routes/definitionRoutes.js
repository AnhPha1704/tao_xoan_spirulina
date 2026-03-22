import express from 'express';
import genericController from '../controllers/genericController.js';
import { Definition } from '../models/Definition.js';
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
router.get('/definitions/active', async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (activeDef) {
            res.json(activeDef);
        } else {
            res.status(404).json({ message: 'No active definition found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

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
router.post('/definitions', protect, genericController.create(Definition));

export default router;
