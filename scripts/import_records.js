import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Definition } from '../src/models/Definition.js';
import { Record } from '../src/models/Record.js';
import { connectDB } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const importData = async () => {
    try {
        await connectDB();

        // 1. Ensure a Definition exists
        let definition = await Definition.findOne({ version_id: 'seed_v1' });

        if (!definition) {
            console.log('Creating new Definition...');
            definition = new Definition({
                version_id: 'seed_v1',
                active: true,
                columns: [
                    { key: 'OD680', type: 'number' },
                    { key: 'pH', type: 'number' },
                    { key: 'temperature_C', type: 'number' },
                    { key: 'light_lux', type: 'number' },
                    { key: 'EC_uS', type: 'number' },
                    { key: 'contamination_flag', type: 'boolean' }
                ]
            });
            await definition.save();
            console.log(`Definition created with ID: ${definition._id}`);
        } else {
            console.log(`Using existing Definition with ID: ${definition._id}`);
        }

        // 2. Read seed data
        const seedFilePath = path.resolve(__dirname, '../doc/records_seed.json');
        const seedDataRaw = fs.readFileSync(seedFilePath, 'utf-8');
        const seedRecords = JSON.parse(seedDataRaw);
        
        console.log(`Found ${seedRecords.length} records in seed file.`);

        // 3. Prepare records for insertion
        const recordsToInsert = seedRecords.map(record => ({
            definition_id: definition._id,
            values: record.values,
            // You could optionally add logic here to spread out created_date backwards in time if desired,
            // but for a simple seed, using default Date.now from mongoose schema works.
        }));

        // 4. Insert data
        console.log('Clearing existing seed data if any (optional, commenting out for safety, only inserting)...');
        // await Record.deleteMany({ definition_id: definition._id }); 
        
        console.log('Inserting records...');
        const inserted = await Record.insertMany(recordsToInsert);
        
        console.log(`Successfully imported ${inserted.length} records!`);
        
        process.exit(0);
    } catch (error) {
        console.error(`Error importing data: ${error.message}`);
        process.exit(1);
    }
};

importData();
