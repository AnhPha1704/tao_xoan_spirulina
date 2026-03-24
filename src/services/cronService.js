import cron from 'node-cron';
import fetch from 'node-fetch';
import { Definition } from '../models/Definition.js';
import { Record } from '../models/Record.js';

const TARGET_API_URL = 'http://45.117.179.192:8000/api/log/last-log/C004';

// Hàm phụ: Tự động cập nhật columns cho Definition nếu có cảm biến mới
const updateDefinitionColumns = async (definition, values, stationCode) => {
    const currentKeys = definition.columns.map(c => c.key);
    const newKeys = values.map(v => v.key);
    const needsUpdate = newKeys.some(k => !currentKeys.includes(k));

    if (needsUpdate) {
        console.log(`[Cron Job] Phát hiện cảm biến mới cho trạm ${stationCode}. Đang cập nhật columns...`);
        const updatedColumns = [...definition.columns];
        newKeys.forEach(k => {
            if (!currentKeys.includes(k)) {
                updatedColumns.push({ key: k, type: 'number', required: false });
            }
        });
        definition.columns = updatedColumns;
        await definition.save();
    }
};

// Hàm lấy dữ liệu từ API bên ngoài
export const fetchStationData = async () => {
    try {
        console.log('[Cron Job] Đang kéo dữ liệu từ API C004...');
        const response = await fetch(TARGET_API_URL, { timeout: 10000 });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let sensorsData = data.data || data;

        if (Array.isArray(sensorsData)) {
            if (sensorsData.length === 0) return;

            // Handle array of sensors: [{sensor_name: 'DO', value: 1}, {sensor_name: 'PH', value: 7}]
            if (sensorsData[0].sensor_name && !sensorsData[0].stationCode) {
                const grouped = { stationCode: sensorsData[0].version_id || sensorsData[0].station_id || 'C004' };
                sensorsData.forEach(item => {
                    if (item.sensor_name && typeof item.value !== 'undefined') {
                        grouped[item.sensor_name] = item.value;
                    }
                });
                sensorsData = grouped;
            } else {
                sensorsData = sensorsData[0];
            }
        }

        const { stationCode, ...sensors } = sensorsData;

        if (!stationCode) {
            console.log('[Cron Job] Dữ liệu API không chứa stationCode (Cấu trúc lạ). Bỏ qua.');
            return;
        }

        let targetDef = await Definition.findOne({ version_id: stationCode });
        if (!targetDef) {
            console.log(`[Cron Job] Không tìm thấy máy Trạm: ${stationCode}. Bỏ qua.`);
            return;
        }

        const values = Object.entries(sensors)
            .filter(([key, value]) => typeof value === 'number' || (typeof value === 'string' && !isNaN(value)))
            .map(([key, value]) => ({
                key,
                value: typeof value === 'string' ? parseFloat(value) : value
            }));

        if (values.length > 0) {
            const newRecord = new Record({
                definition_id: targetDef._id,
                values: values,
                created_date: new Date()
            });

            await newRecord.save();
            console.log(`[Cron Job] Đã lưu thành công 1 bản ghi cho trạm: ${stationCode}`);

            // Tự động cập nhật columns
            await updateDefinitionColumns(targetDef, values, stationCode);
        } else {
            console.log('[Cron Job] Dữ liệu API không chứa cảm biến hợp lệ!');
        }
    } catch (error) {
        console.error('[Cron Job] Lỗi Fetch Data:', error.message);
    }
};

// Khởi chạy các Job Scheduler định kỳ
export const initCronJobs = () => {
    // Chạy mỗi 10 phút
    cron.schedule('*/10 * * * *', () => {
        fetchStationData();
    });
    console.log('Đã nạp Job Scheduler theo chu kỳ: Mỗi 10 Phút kéo dữ liệu cập nhật.');
};
