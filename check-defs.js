import mongoose from 'mongoose';
import { Definition } from './src/models/Definition.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spirulina_db');
    const defs = await Definition.find({});
    console.log('Definitions in DB:', JSON.stringify(defs, null, 2));
    mongoose.connection.close();
}
check();
