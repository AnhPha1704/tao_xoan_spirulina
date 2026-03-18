import { Record } from '../models/Record.js';
import { Definition } from '../models/Definition.js';
import genericController from './genericController.js';

// [Dữ liệu đo đạc]
export const getAllRecords = genericController.getAll(Record);
export const createRecord = genericController.create(Record);
export const updateRecordById = genericController.update(Record);
export const getRecordById = genericController.get(Record);
export const deleteRecordById = genericController.delete(Record);

// Xóa hàng loạt theo trạm
export const deleteRecords = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const result = await Record.deleteMany({ definition_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Lấy dữ liệu cho trạm đang hoạt động
export const getRecordsByActiveDefinition = async (req, res) => {
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
};

// Xuất các records theo ngưỡng và loại thông tin cần lọc
export const getRecordsByFilter = async (req, res) => {
    try {
        const { key, min, max } = req.query;
        if (!key) {
            return res.status(400).json({ message: 'Key is required for filtering' });
        }

        const query = {
            values: {
                $elemMatch: {
                    key: key
                }
            }
        };

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
};

// Xuất ra tất cả những records mà có cấu trúc bảng gồm 5 trường trở lên
export const getRecordsByStructureSize = async (req, res) => {
    try {
        // Tìm các Definition có columns >= 5
        const complexDefs = await Definition.find({
            $expr: { $gte: [{ $size: "$columns" }, 5] }
        });

        const defIds = complexDefs.map(d => d._id);
        const records = await Record.find({ definition_id: { $in: defIds } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xuất các bản ghi được tạo sau ngày chỉ định (Mặc định 01/02/2026)
export const getRecordsAfterDate = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date('2026-02-01');

        const records = await Record.find({
            created_date: { $gt: targetDate }
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
