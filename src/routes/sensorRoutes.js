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
router.get('/definitions', getAllDefinitions);
router.get('/definitions/active', getActiveDefinition);
router.get('/:definition_id/GetAllRecords', getAllRecords);

// Protected routes (JWT Bonus)
router.post('/definitions', protect, createDefinition);
router.post('/:definition_id/records', protect, createRecord);
router.post('/:definitions_id/DeleteRecords', protect, deleteRecords);
router.post('/:definitions_id/UpdateRecordById/:record_id', protect, updateRecordById);

export default router;
