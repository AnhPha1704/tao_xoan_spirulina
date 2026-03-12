import { Definition } from '../models/Definition.js';
import { Record } from '../models/Record.js';

// GET: api/Sensors/definitions
export const getAllDefinitions = async (req, res) => {
    try {
        const definitions = await Definition.find({});
        res.json(definitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/definitions/active
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

// POST: api/Sensors/definitions
export const createDefinition = async (req, res) => {
    try {
        const newDef = new Definition(req.body);
        const savedDef = await newDef.save();
        res.status(201).json(savedDef);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/:definition_id/GetAllRecords
export const getAllRecords = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const records = await Record.find({ definition_id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definition_id/records
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

// POST: api/Sensors/:definitions_id/DeleteRecords
export const deleteRecords = async (req, res) => {
    try {
        const { definitions_id } = req.params; // definitions_id from route parameter
        const result = await Record.deleteMany({ definition_id: definitions_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definitions_id/UpdateRecordById/:record_id
export const updateRecordById = async (req, res) => {
    try {
        const { record_id } = req.params;
        // Update any info from req.body
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
