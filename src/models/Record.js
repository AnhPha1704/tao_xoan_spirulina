import mongoose from 'mongoose';
import { Definition } from './Definition.js';

const ValueKVSchema = new mongoose.Schema(
    {
        key: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed }
    },
    { _id: false }
);

const RecordSchema = new mongoose.Schema(
    {
        definition_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Definition', required: true, index: true },
        values: { type: [ValueKVSchema], default: [] },
        created_date: { type: Date, default: Date.now, index: true }
    },
    { timestamps: false }
);

RecordSchema.index({ definition_id: 1, created_date: -1 });

export const Record = mongoose.model('Record', RecordSchema);
