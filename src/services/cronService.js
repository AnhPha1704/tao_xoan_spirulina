import cron from 'node-cron';
import fetch from 'node-fetch';
import { Definition } from '../models/Definition.js';
import { Record } from '../models/Record.js';

const TARGET_API_URL = 'http://45.117.179.192:8000/api/log/last-log/C003';

// Hàm Service kéo logic data C003
export const fetchLogC003 = async () => {
    try {
        console.log('[Cron Job] Đang kéo dữ liệu từ API C003...');
        const response = await fetch(TARGET_API_URL, { timeout: 10000 });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('[Cron Job] Lấy dữ liệu thành công:', data);

        // Lấy Definition ID hiện đang active ở mảng (Mặc định coi như C003)
        const activeDef = await Definition.findOne({ active: true });
        if (!activeDef) {
            console.log('[Cron Job] Lỗi: Không tìm thấy Definition nào đang active để gán Record.');
            return;
        }

        // Bóc tách API data giả định và convert sang chuẩn [{key, value}] của Mongoose
        // Lưu ý: data trả về có thể được lồng trong data.data hoặc object phẳng
        const sourceData = data.data || data;

        const values = [];
        for (const [key, value] of Object.entries(sourceData)) {
            // Loại trừ một số key system nếu có (như _id, timestamp, id...)
            if (key === '_id' || key === 'id' || key === 'timestamp' || key === 'created_at') continue;

            // Xử lý giá trị có thể parse ra Number được
            const parsedVal = typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value;
            values.push({ key, value: parsedVal });
        }

        if (values.length > 0) {
            const newRecord = new Record({
                definition_id: activeDef._id,
                values: values,
                created_date: new Date()
            });

            await newRecord.save();
            console.log(`[Cron Job] Đã lưu thành công 1 bản ghi vào DB dưới trạm ID: ${activeDef._id}`);
        } else {
            console.log('[Cron Job] Body API không chứa tham số Cảm biến nào hợp lệ!');
        }

    } catch (error) {
        console.error('[Cron Job] Lỗi tự động Fetch Data:', error.message);
    }
};

// Khởi chạy Hẹn giờ (Mỗi 10 phút)
export const initCronJobs = () => {
    // Cron định dạng: Mỗi phút chia hết cho 10 (0, 10, 20...)
    cron.schedule('*/10 * * * *', () => {
        fetchLogC003();
    });
    console.log('✅ Đã nạp Job Scheduler theo chu kỳ: Mỗi 10 Phút kéo dữ liệu C003.');
};
