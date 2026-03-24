import mongoose from 'mongoose';
import { Record } from './src/models/Record.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spirulina_db')
    .then(async () => {
        console.log("Connected to MongoDB.");
        const records = await Record.find({ definition_id: "69b55761a4c89d7e8e4121f9" });
        console.log("Count with 69b55761a4c89d7e8e4121f9:", records.length);
        
        const map = {};
        records.forEach(r => {
            const idStr = String(r.definition_id);
            map[idStr] = (map[idStr] || 0) + 1;
        });
        console.log("Distinct definition_ids in result:", map);

        const all = await Record.find({});
        console.log("Total records in DB:", all.length);

        mongoose.connection.close();
    })
    .catch(err => console.error(err));
