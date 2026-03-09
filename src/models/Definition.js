import mongoose from 'mongoose';

const ColumnSchema = new mongoose.Schema(
    {
        key: { type: String, required: true },
        type: { type: String, enum: ['string', 'number', 'boolean', 'date', 'object', 'array'], required: true },
        required: { type: Boolean, default: false },
        enum: { type: [mongoose.Schema.Types.Mixed] },
        min: { type: Number },
        max: { type: Number },
    },
    { _id: false }
);

const DefinitionSchema = new mongoose.Schema(
    {
        version_id: { type: String, required: true, unique: true, index: true },
        columns: { type: [ColumnSchema], default: [] },
        active: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Definition = mongoose.model('Definition', DefinitionSchema);
