import { Record } from '../models/Record.js';
import { Definition } from '../models/Definition.js';

// [Yêu cầu 4]: API lấy tất cả bản ghi theo definition_id
export const getAllRecords = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const records = await Record.find({ definition_id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Yêu cầu 4]: API tạo mới bản ghi đo đạc
export const createRecord = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const recordData = { ...req.body, definition_id };
        const newRecord = new Record(recordData);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Yêu cầu 4 & 7]: API xóa đồng loạt các bản ghi theo definition_id (VerifyToken yêu cầu tại route)
export const deleteRecords = async (req, res) => {
    try {
        const { definitions_id } = req.params;
        const result = await Record.deleteMany({ definition_id: definitions_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Yêu cầu 4]: API cập nhật thông tin record theo ID
export const updateRecordById = async (req, res) => {
    try {
        const { record_id } = req.params;
        const updatedRecord = await Record.findByIdAndUpdate(
            record_id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (updatedRecord) {
            res.json(updatedRecord);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// [Yêu cầu 7]: Xuất tất cả các records cho structure là active
export const getRecordsByActiveDefinition = async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (!activeDef) {
            return res.status(404).json({ message: 'No active definition found' });
        }
        const records = await Record.find({ definition_id: activeDef._id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Yêu cầu 7]: Xuất các records theo ngưỡng và loại thông tin cần lọc
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

// [Yêu cầu 7]: Xuất ra tất cả những records mà có cấu trúc bảng gồm 5 trường trở lên
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

// [Yêu cầu 7]: Xuất các bản ghi được tạo sau ngày chỉ định (Mặc định 01/02/2026)
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
