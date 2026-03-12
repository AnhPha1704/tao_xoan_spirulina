import cron from 'node-cron';
import fetch from 'node-fetch';
import { Definition } from '../models/Definition.js';
import { Record } from '../models/Record.js';

const TARGET_API_URL = 'http://45.117.179.192:8000/api/log/last-log/C004';

// Hàm Service kéo logic data C003
export const fetchLogC003 = async () => {
    try {
        console.log('[Cron Job] Đang kéo dữ liệu từ API C004...');
        const response = await fetch(TARGET_API_URL, { timeout: 10000 });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sourceData = data.data || data;
        let stationCode = 'UNKNOWN_STATION';
        if (Array.isArray(sourceData) && sourceData.length > 0 && sourceData[0].cluster_code) {
            stationCode = sourceData[0].cluster_code;
        }

        let targetDef = await Definition.findOne({ version_id: stationCode });

        if (!targetDef) {
            console.log(`[Cron Job] Trạm ${stationCode} mới. Đang khởi tạo...`);
            await Definition.updateMany({}, { active: false });

            const newDef = new Definition({
                version_id: stationCode,
                active: true,
                columns: []
            });
            targetDef = await newDef.save();
        }

        const values = [];

        if (Array.isArray(sourceData)) {
            sourceData.forEach(item => {
                if (item.sensor_name && item.value !== undefined) {
                    const parsedVal = typeof item.value === 'string' && !isNaN(item.value) ? parseFloat(item.value) : item.value;
                    values.push({ key: item.sensor_name, value: parsedVal });
                }
            });
        } else {
            for (const [key, value] of Object.entries(sourceData)) {
                if (key === '_id' || key === 'id' || key === 'timestamp' || key === 'created_at') continue;
                const parsedVal = typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value;
                values.push({ key, value: parsedVal });
            }
        }

        if (values.length > 0) {
            const newRecord = new Record({
                definition_id: targetDef._id,
                values: values,
                created_date: new Date()
            });

            await newRecord.save();
            console.log(`[Cron Job] Đã lưu thành công 1 bản ghi vào DB dưới trạm ID: ${targetDef._id} (${stationCode})`);
        } else {
            console.log('[Cron Job] Body API không chứa tham số Cảm biến nào hợp lệ!');
        }

    } catch (error) {
        console.error('[Cron Job] Lỗi tự động Fetch Data:', error.message);
    }
};

export const initCronJobs = () => {
    fetchLogC003();

    cron.schedule('*/10 * * * *', () => {
        fetchLogC003();
    });
    console.log('✅ Đã nạp Job Scheduler theo chu kỳ: Mỗi 10 Phút kéo dữ liệu cập nhật.');
};
