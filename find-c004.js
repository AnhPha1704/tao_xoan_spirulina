import mongoose from 'mongoose';
import { Definition } from './src/models/Definition.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spirulina_db');
    const def = await Definition.findOne({ version_id: 'C004' });
    console.log('Definition C004:', JSON.stringify(def, null, 2));
    mongoose.connection.close();
}
check();
