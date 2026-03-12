import express from 'express';
import {
    getAllDefinitions,
    getActiveDefinition,
    getAllRecords,
    deleteRecords,
    updateRecordById,
    createDefinition,
    createRecord
} from '../controllers/sensorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes

/**
 * @swagger
 * /api/Sensors/definitions:
 *   get:
 *     summary: Lấy danh sách tất cả các cấu trúc (Definitions).
 *     tags: [Sensors]
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
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Trả về object Definition active.
 *       404:
 *         description: No active definition found.
 */
router.get('/definitions/active', getActiveDefinition);
/**
 * @swagger
 * /api/Sensors/{definition_id}/GetAllRecords:
 *   get:
 *     summary: Lấy tất cả các dữ liệu lịch sử đo đạt từ bảng Records dựa theo definition_id.
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công.
 */
router.get('/:definition_id/GetAllRecords', getAllRecords);

// Protected routes (JWT Bonus)

/**
 * @swagger
 * /api/Sensors/definitions:
 *   post:
 *     summary: Tạo mới máy Trạm (Definition) (Yêu cầu JWT).
 *     tags: [Sensors]
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
/**
 * @swagger
 * /api/Sensors/{definition_id}/records:
 *   post:
 *     summary: Tạo mới bản ghi Lịch sử (Record) (Yêu cầu JWT).
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         required: true
 *         schema:
 *           type: string
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
router.post('/:definition_id/records', protect, createRecord);
/**
 * @swagger
 * /api/Sensors/{definitions_id}/DeleteRecords:
 *   post:
 *     summary: Xóa đồng loạt tất cả các cảm biến đi theo với definition_id (Yêu cầu JWT).
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definitions_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa n records.
 */
router.post('/:definitions_id/DeleteRecords', protect, deleteRecords);
/**
 * @swagger
 * /api/Sensors/{definitions_id}/UpdateRecordById/{record_id}:
 *   post:
 *     summary: Cập nhật thông tin của record theo JSON payload (Yêu cầu JWT).
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definitions_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: record_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Update thành công.
 */
router.post('/:definitions_id/UpdateRecordById/:record_id', protect, updateRecordById);

export default router;
