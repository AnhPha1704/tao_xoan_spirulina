import { Definition } from '../models/Definition.js';

// [Yêu cầu 4]: Lấy tất cả các cấu trúc hiện có
export const getAllDefinitions = async (req, res) => {
    try {
        const definitions = await Definition.find({});
        res.json(definitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Yêu cầu 4]: Lấy cấu trúc active hiện tại
export const getActiveDefinition = async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (activeDef) {
            res.json(activeDef);
        } else {
            res.status(404).json({ message: 'No active definition found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [Yêu cầu 4]: Tạo mới cấu trúc định nghĩa cảm biến
export const createDefinition = async (req, res) => {
    try {
        const newDef = new Definition(req.body);
        const savedDef = await newDef.save();
        res.status(201).json(savedDef);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
