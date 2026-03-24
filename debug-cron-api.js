import fetch from 'node-fetch';

const TARGET_API_URL = 'http://45.117.179.192:8000/api/log/last-log/C004';

async function test() {
    try {
        console.log('Fetching from API...');
        const response = await fetch(TARGET_API_URL);
        const data = await response.json();
        console.log('Full API Response:', JSON.stringify(data, null, 2));
        
        let sensorsData = data.data || data;
        if (Array.isArray(sensorsData)) {
            console.log('Is Array, length:', sensorsData.length);
            sensorsData = sensorsData[0];
        }
        
        console.log('First object keys:', Object.keys(sensorsData || {}));
        console.log('stationCode value:', sensorsData?.stationCode);
    } catch (err) {
        console.error(err);
    }
}

test();
