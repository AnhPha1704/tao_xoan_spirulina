import express from 'express';
import genericController from '../controllers/genericController.js';
import { Record } from '../models/Record.js';
import { Definition } from '../models/Definition.js';
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
router.get('/:definition_id/GetAllRecords', genericController.getAll(Record));

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
router.get('/records/active-definition', async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (!activeDef) {
            return res.status(404).json({ message: 'No active definition found' });
        }
        const records = await Record.find({ definition_id: activeDef._id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

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
router.get('/records/filter', async (req, res) => {
    try {
        const { key, min, max } = req.query;
        if (!key) {
            return res.status(400).json({ message: 'Key is required for filtering' });
        }
        const query = { values: { $elemMatch: { key } } };
        if (min !== undefined || max !== undefined) {
            query.values.$elemMatch.value = {};
            if (min !== undefined) query.values.$elemMatch.value.$gte = Number(min);
            if (max !== undefined) query.values.$elemMatch.value.$lte = Number(max);
        }
        const records = await Record.find(query);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
router.get('/records/complex-structure', async (req, res) => {
    try {
        const complexDefs = await Definition.find({
            $expr: { $gte: [{ $size: '$columns' }, 5] }
        });
        const defIds = complexDefs.map(d => d._id);
        const records = await Record.find({ definition_id: { $in: defIds } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
router.get('/records/after-date', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date('2026-02-01');
        const records = await Record.find({ created_date: { $gt: targetDate } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
router.post('/:definition_id/records', protect, genericController.create(Record));

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
router.post('/:definition_id/DeleteRecords', protect, async (req, res) => {
    try {
        const { definition_id } = req.params;
        const result = await Record.deleteMany({ definition_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

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
router.post('/:definition_id/UpdateRecordById/:record_id', protect, genericController.update(Record));

export default router;
