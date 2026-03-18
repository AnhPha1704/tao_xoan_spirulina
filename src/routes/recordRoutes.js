import express from 'express';
import {
    getAllRecords,
    createRecord,
    deleteRecords,
    updateRecordById,
    getRecordsByActiveDefinition,
    getRecordsByFilter,
    getRecordsByStructureSize,
    getRecordsAfterDate
} from '../controllers/recordController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/Sensors/{definition_id}/GetAllRecords:
 *   get:
 *     summary: Lấy tất cả các dữ liệu lịch sử đo đạt từ bảng Records dựa theo definition_id.
 *     tags: [Records]
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

/**
 * @swagger
 * /api/Sensors/{definition_id}/records:
 *   post:
 *     summary: Tạo mới bản ghi Lịch sử (Record) (Yêu cầu JWT).
 *     tags: [Records]
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
 * /api/Sensors/{definition_id}/UpdateRecordById/{record_id}:
 *   post:
 *     summary: Cập nhật thông tin của record theo JSON payload (Yêu cầu JWT).
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definition_id
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
router.post('/:definition_id/UpdateRecordById/:record_id', protect, updateRecordById);

/**
 * @swagger
 * /api/Sensors/{definition_id}/DeleteRecords:
 *   post:
 *     summary: Xóa đồng loạt tất cả các cảm biến đi theo với definition_id (Yêu cầu JWT).
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa n records.
 */
router.post('/:definition_id/DeleteRecords', protect, deleteRecords);

// =========================================================================
// [Yêu cầu 7]: Các API lọc và xuất dữ liệu nâng cao
// =========================================================================

/**
 * @swagger
 * /api/Sensors/records/active-definition:
 *   get:
 *     summary: Xuất tất cả các records cho cấu trúc (Definition) đang active.
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: Trả về danh sách records.
 */
router.get('/records/active-definition', getRecordsByActiveDefinition);

/**
 * @swagger
 * /api/Sensors/records/filter:
 *   get:
 *     summary: Xuất các records theo ngưỡng và loại thông tin cần lọc (Ví dụ ?key=temperature&min=25&max=27).
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Trả về danh sách records thỏa điều kiện.
 */
router.get('/records/filter', getRecordsByFilter);

/**
 * @swagger
 * /api/Sensors/records/complex-structure:
 *   get:
 *     summary: Xuất ra tất cả những records mà có cấu trúc bảng gồm 5 trường trở lên.
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: Trả về danh sách records.
 */
router.get('/records/complex-structure', getRecordsByStructureSize);

/**
 * @swagger
 * /api/Sensors/records/after-date:
 *   get:
 *     summary: Xuất các bản ghi được tạo sau ngày chỉ định (Mặc định 2026-02-01).
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Trả về danh số bản ghi.
 */
router.get('/records/after-date', getRecordsAfterDate);

export default router;
