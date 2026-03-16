import express from 'express';
import {
    getAllDefinitions,
    getActiveDefinition,
    createDefinition
} from '../controllers/definitionController.js';
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

// Public routes

// [Yêu cầu 4 & 6]: API lấy danh sách cấu trúc (Definitions)
router.get('/definitions', getAllDefinitions);
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
// [Yêu cầu 4 & 6]: API lấy cấu trúc active
router.get('/definitions/active', getActiveDefinition);
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
// [Yêu cầu 4 & 6]: API lấy tất cả bản ghi theo definition_id
router.get('/:definition_id/GetAllRecords', getAllRecords);
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
// [Yêu cầu 7 & 6]: API lấy records của trạm active
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
// [Yêu cầu 7 & 6]: API lọc theo ngưỡng và loại thông tin
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
// [Yêu cầu 7 & 6]: API lọc các trạm có 5+ cột
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
// [Yêu cầu 7 & 6]: API lọc theo ngày tạo
router.get('/records/after-date', getRecordsAfterDate);

// Protected routes (JWT Bonus)

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
// [Yêu cầu 4 & 6]: API tạo mới Definition (Bonus JWT)
router.post('/definitions', protect, createDefinition);
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
// [Yêu cầu 4 & 6]: API tạo mới Record (Bonus JWT)
router.post('/:definition_id/records', protect, createRecord);
/**
 * @swagger
 * /api/Sensors/{definitions_id}/DeleteRecords:
 *   post:
 *     summary: Xóa đồng loạt tất cả các cảm biến đi theo với definition_id (Yêu cầu JWT).
 *     tags: [Records]
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
// [Yêu cầu 4, 6, 7]: API xóa đồng loạt records (Bonus JWT, Requirement verifyToken)
router.post('/:definitions_id/DeleteRecords', protect, deleteRecords);
/**
 * @swagger
 * /api/Sensors/{definitions_id}/UpdateRecordById/{record_id}:
 *   post:
 *     summary: Cập nhật thông tin của record theo JSON payload (Yêu cầu JWT).
 *     tags: [Records]
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
// [Yêu cầu 4 & 6]: API cập nhật record theo ID (Bonus JWT)
router.post('/:definitions_id/UpdateRecordById/:record_id', protect, updateRecordById);

export default router;
