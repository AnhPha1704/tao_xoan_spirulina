import mongoose from 'mongoose';
import Cluster from './models/Cluster.js';
import SensorType from './models/SensorType.js';
import Record from './models/Record.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spirulina_db';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Đã kết nối với MongoDB để thêm dữ liệu mẫu');

        // Xoá dữ liệu cũ
        await Promise.all([
            Cluster.deleteMany({}),
            SensorType.deleteMany({}),
            Record.deleteMany({})
        ]);
        console.log('🧹 Đã dọn dẹp dữ liệu cũ (Cleaned out old databes)');

        // 1. Tạo loại cảm biến (SensorTypes)
        const sensorTypesData = [
            { name: 'Nhiệt độ', unit: '°C', description: 'Đo nhiệt độ môi trường (Ngưỡng 25-35°C)' },
            { name: 'Độ ẩm', unit: '%', description: 'Đo độ ẩm' },
            { name: 'pH', unit: 'pH', description: 'Độ pH của nước (Ngưỡng 8-10)' },
            { name: 'Ánh sáng', unit: 'lux', description: 'Cường độ ánh sáng (8-12 giờ/ngày)' },
            { name: 'CO2', unit: '%', description: 'Nồng độ CO2 (Ngưỡng 1-2%)' },
            { name: 'Độ mặn', unit: '%', description: 'Độ mặn (Ngưỡng 1-2%)' },
            { name: 'DO', unit: 'mg/L', description: 'Oxy hòa tan' },
            { name: 'EC', unit: 'mS', description: 'Độ dẫn điện' },
            { name: 'Áp suất', unit: 'atm', description: 'Áp suất môi trường' },
        ];

        const createdSensorTypes = await SensorType.insertMany(sensorTypesData);
        console.log('🌱 Đã thêm', createdSensorTypes.length, 'loại cảm biến');

        // Hàm tiện ích để lấy _id theo tên loại cảm biến
        const getSensorTypeId = (name) => {
            const type = createdSensorTypes.find(s => s.name === name);
            return type ? type._id : null;
        };

        // 2. Tạo Clusters (Cụm nước C003, C004 theo đề bài)
        const clustersData = [
            {
                name: 'C003',
                type: 'không khí',
                location: 'Khu vực nuôi ngoài trời A',
                sensors: [
                    getSensorTypeId('Nhiệt độ'),
                    getSensorTypeId('Áp suất'),
                    getSensorTypeId('Độ ẩm'),
                    getSensorTypeId('Ánh sáng')
                ]
            },
            {
                name: 'C004',
                type: 'nước',
                location: 'Khu vục hồ nuôi chính C',
                sensors: [
                    getSensorTypeId('DO'),
                    getSensorTypeId('pH'),
                    getSensorTypeId('EC'),
                    getSensorTypeId('Nhiệt độ')
                ]
            }
        ];

        const createdClusters = await Cluster.insertMany(clustersData);
        console.log('🏢 Đã thêm', createdClusters.length, 'Cụm thiết bị');

        // 3. Tạo dữ liệu mẫu (Records) giả lập
        const recordsData = [];

        // Tạo data cho C003
        const cluster003 = createdClusters.find(c => c.name === 'C003');
        if (cluster003) {
            recordsData.push({ clusterId: cluster003._id, sensorTypeId: getSensorTypeId('Nhiệt độ'), value: 28.5 });
            recordsData.push({ clusterId: cluster003._id, sensorTypeId: getSensorTypeId('Áp suất'), value: 1.0 });
            recordsData.push({ clusterId: cluster003._id, sensorTypeId: getSensorTypeId('Độ ẩm'), value: 20.5 });
            recordsData.push({ clusterId: cluster003._id, sensorTypeId: getSensorTypeId('Ánh sáng'), value: 0.0 });
        }

        // Tạo data cho C004
        const cluster004 = createdClusters.find(c => c.name === 'C004');
        if (cluster004) {
            recordsData.push({ clusterId: cluster004._id, sensorTypeId: getSensorTypeId('DO'), value: 3.9 });
            recordsData.push({ clusterId: cluster004._id, sensorTypeId: getSensorTypeId('pH'), value: 7.5 });
            recordsData.push({ clusterId: cluster004._id, sensorTypeId: getSensorTypeId('EC'), value: 0.1 });
            recordsData.push({ clusterId: cluster004._id, sensorTypeId: getSensorTypeId('Nhiệt độ'), value: 28.7 });
        }

        await Record.insertMany(recordsData);
        console.log('📈 Đã thêm', recordsData.length, 'Bản ghi lịch sử đo đạt');

        console.log('🎉 Hoàn thành quá trình nạp dữ liệu (seeding)!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi nạp dữ liệu mẫu:', error);
        process.exit(1);
    }
};

seedData();
