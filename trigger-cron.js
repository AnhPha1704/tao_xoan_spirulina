import { fetchStationData } from './src/services/cronService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spirulina_db');
        console.log('Connected to DB. Triggering fetchStationData...');
        await fetchStationData();
        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
