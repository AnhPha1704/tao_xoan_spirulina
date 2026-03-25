import mongoose from 'mongoose';
import { Record } from '../models/Record.js';
import { Definition } from '../models/Definition.js';

export const getAllRecordsByDefinitionId = async (req, res) => {
    try {
        const { definition_id } = req.params;
        console.log("getAllRecordsByDefinitionId called with params:", req.params);
        if (!definition_id) {
            return res.status(400).json({ message: "definition_id is missing in params" });
        }
        const records = await Record.find({ definition_id });
        res.status(200).json({ results: records });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const createRecordWithDefinitionId = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const newRecord = new Record({
            _id: new mongoose.Types.ObjectId(),
            definition_id,
            ...req.body
        });
        const result = await newRecord.save();
        res.status(201).json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

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
//sua cu phap 55-59
export const filterRecords = async (req, res) => {
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
};
// 71-72
export const getRecordsComplexStructure = async (req, res) => {
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
};

export const getRecordsAfterDate = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date('2026-02-01');
        const records = await Record.find({ created_date: { $gt: targetDate } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRecordsByDefinitionId = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const result = await Record.deleteMany({ definition_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
