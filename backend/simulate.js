import mongoose from 'mongoose';
import Cluster from './models/Cluster.js';
import SensorType from './models/SensorType.js';
import Record from './models/Record.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spirulina_db';

// Hàm ngẫu nhiên
const randomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

const simulateData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Bắt đầu tiến trình giả lập (Simulation) dữ liệu hệ thống Spirulina!');

        const clusters = await Cluster.find();
        if (clusters.length === 0) {
            console.log('❌ CSDL trống, vui lòng chạy seed.js trước.');
            process.exit();
        }

        const sensorTypes = await SensorType.find();

        // Cấu hình các dải giả lập (Cố tình làm cho dễ bị chạm ngưỡng thỉnh thoảng)
        const generators = {
            'Nhiệt độ': () => randomFloat(20, 40), // Ngưỡng an toàn: 25-35
            'pH': () => randomFloat(6.5, 11),      // Ngưỡng an toàn: 8-10
            'Độ ẩm': () => randomFloat(40, 90),
            'Ánh sáng': () => randomFloat(0, 5000),
            'Áp suất': () => randomFloat(0.8, 1.2),
            'DO': () => randomFloat(2, 8),
            'EC': () => randomFloat(0, 0.5),
            'CO2': () => randomFloat(0.5, 3),      // Ngưỡng an toàn: 1-2
            'Độ mặn': () => randomFloat(0.5, 3)    // Ngưỡng an toàn: 1-2
        };

        console.log('🔄 Đang chạy ngầm giả lập. Ấn Ctrl+C để dừng.');

        // Chạy vô hạn mỗi 5 giây
        setInterval(async () => {
            let bulkRecords = [];

            for (const cluster of clusters) {
                // Với mỗi cụm, sinh dữ liệu cho các cảm biến đang có của nó
                for (const sensorId of cluster.sensors) {
                    const type = sensorTypes.find(t => t._id.toString() === sensorId.toString());
                    if (!type) continue;

                    let val = 0;
                    if (generators[type.name]) {
                        val = generators[type.name]();
                    } else {
                        val = randomFloat(0, 100);
                    }

                    bulkRecords.push({
                        clusterId: cluster._id,
                        sensorTypeId: type._id,
                        value: val,
                        recordedAt: new Date()
                    });
                }
            }

            await Record.insertMany(bulkRecords);
            const anomalousRecords = bulkRecords.filter(r => {
                // In log ra nếu nó rơi vào các dải nguy hiểm
                const name = sensorTypes.find(t => t._id.toString() === r.sensorTypeId.toString()).name;
                if (name === 'pH' && (r.value < 8 || r.value > 10)) return true;
                if (name === 'Nhiệt độ' && (r.value < 25 || r.value > 35)) return true;
                if (name === 'CO2' && (r.value < 1 || r.value > 2)) return true;
                return false;
            });

            console.log(`[${new Date().toLocaleTimeString()}] Đã thêm ${bulkRecords.length} record. Trong đó có ${anomalousRecords.length} cảnh báo nguy hiểm!`);

        }, 5000);

    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

simulateData();
