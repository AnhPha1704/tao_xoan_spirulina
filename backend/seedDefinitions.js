import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Definition from './models/Definition.js';
import Record from './models/Record.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spirulina_db';

const seedDefinitions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Kết nối MongoDB thành công. Bắt đầu seed definitions...');

        // Xóa dữ liệu definitions cũ
        await Definition.deleteMany({});
        console.log('🗑️  Đã xóa definitions cũ.');

        // Tạo 3 definitions mẫu
        const definitions = await Definition.insertMany([
            {
                name: 'Bộ đo Ao Ngoài Trời',
                description: 'Cấu trúc cảm biến cho các ao nuôi ngoài trời, đo nhiệt độ, pH và ánh sáng.',
                sensorList: ['Nhiệt độ', 'pH', 'Ánh sáng', 'DO'],
                isActive: true,
            },
            {
                name: 'Bộ đo Bể Kín CO2',
                description: 'Cấu trúc cho bể kín có bơm CO2, tập trung đo nồng độ khí.',
                sensorList: ['CO2', 'Nhiệt độ', 'pH', 'Độ ẩm'],
                isActive: false,
            },
            {
                name: 'Bộ đo Hồ Nuôi Chính',
                description: 'Cấu trúc toàn diện cho hồ nuôi chính, bao gồm đầy đủ các chỉ số.',
                sensorList: ['pH', 'Nhiệt độ', 'DO', 'EC', 'Độ mặn', 'CO2'],
                isActive: false,
            },
        ]);

        console.log(`✅ Đã tạo ${definitions.length} definitions.`);

        // Seed một số records gắn với definition đầu tiên
        const activeDefinition = definitions[0];
        await Record.insertMany([
            { definitionId: activeDefinition._id, value: 8.5, data: { sensor: 'pH', note: 'Bình thường' }, recordedAt: new Date() },
            { definitionId: activeDefinition._id, value: 28.3, data: { sensor: 'Nhiệt độ', note: 'Trong ngưỡng' }, recordedAt: new Date() },
            { definitionId: activeDefinition._id, value: 11.2, data: { sensor: 'pH', note: 'CAO QUÁ NGƯỠNG!' }, recordedAt: new Date() },
            { definitionId: definitions[1]._id, value: 1.8, data: { sensor: 'CO2', note: 'OK' }, recordedAt: new Date() },
        ]);

        console.log('✅ Đã seed xong records mẫu!');
        console.log('\n📋 Danh sách Definitions đã tạo:');
        definitions.forEach(d => console.log(`  - [${d.isActive ? 'ACTIVE' : '      '}] ${d._id} → ${d.name}`));

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Lỗi khi seed:', err.message);
        mongoose.disconnect();
        process.exit(1);
    }
};

seedDefinitions();
