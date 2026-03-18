import { Definition } from '../models/Definition.js';
import genericController from './genericController.js';

// Lấy tất cả các cấu trúc hiện có
export const getAllDefinitions = genericController.getAll(Definition);

// Lấy cấu trúc active hiện tại
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

// Tạo mới cấu trúc định nghĩa cảm biến
export const createDefinition = genericController.create(Definition);
