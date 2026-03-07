import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, Droplets, Wind, Gauge, Sun, AlertTriangle } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';

// ─── Ngưỡng an toàn theo tên sensor ───────────────────────────
const SAFE_BOUNDS = {
    'pH': { min: 8, max: 10 },
    'Nhiệt độ': { min: 25, max: 35 },
    'CO2': { min: 1, max: 2 },
};

const isAlert = (name, value) => {
    const b = SAFE_BOUNDS[name];
    return b ? (value < b.min || value > b.max) : false;
};

function ClusterDetail() {
    const { id } = useParams();
    const [cluster, setCluster] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chart');
    const [selectedSensor, setSelectedSensor] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/clusters')
            .then(r => r.json())
            .then(data => setCluster(data.find(c => c._id === id)));

        fetch(`http://localhost:5000/api/records/${id}`)
            .then(r => r.json())
            .then(data => {
                setRecords(data);
                setLoading(false);
                if (data.length > 0 && data[0].sensorTypeId) {
                    setSelectedSensor(data[0].sensorTypeId.name);
                }
            })
            .catch(() => setLoading(false));
    }, [id]);

    const getIcon = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('nhiệt')) return <Thermometer className="icon-temp" />;
        if (n.includes('độ ẩm')) return <Wind className="icon-humidity" />;
        if (n.includes('ph') || n.includes('do')) return <Droplets className="icon-water" />;
        if (n.includes('ánh sáng')) return <Sun className="icon-light" />;
        return <Gauge />;
    };

    const sensorNames = [...new Set(records.map(r => r.sensorTypeId?.name).filter(Boolean))];
    const latestBySensor = sensorNames.map(name => records.find(r => r.sensorTypeId?.name === name)).filter(Boolean);

    const filteredRecords = records
        .filter(r => r.sensorTypeId?.name === selectedSensor)
        .slice(0, 50)
        .reverse();

    const chartData = filteredRecords.map(r => ({
        time: new Date(r.recordedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        value: r.value,
        alert: isAlert(selectedSensor, r.value),
    }));

    const bounds = SAFE_BOUNDS[selectedSensor];
    const alertCount = records.filter(r => isAlert(r.sensorTypeId?.name, r.value)).length;

    const CustomDot = ({ cx, cy, payload }) => {
        if (!cx || !cy) return null;
        if (payload.alert) return <circle cx={cx} cy={cy} r={6} fill="#e11d48" stroke="white" strokeWidth={2} />;
        return <circle cx={cx} cy={cy} r={3} fill="#16a34a" />;
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (!cluster) return <div className="error-state">Không tìm thấy cụm cảm biến. <Link to="/">Quay lại</Link></div>;

    return (
        <div className="detail-view">
            <Link to="/" className="back-link"><ArrowLeft size={18} /> Quay lại danh sách</Link>

            <div className="section-header">
                <div className="title-area">
                    <h2>Cụm {cluster.name}</h2>
                    <span className="badge">{cluster.type}</span>
                    {alertCount > 0 && (
                        <span className="badge-alert"><AlertTriangle size={14} /> {alertCount} bản ghi cảnh báo</span>
                    )}
                </div>
                <p className="location-text">📍 {cluster.location}</p>
            </div>

            {/* Thẻ thông số hiện tại */}
            <div className="stats-grid">
                {latestBySensor.map(latest => {
                    const name = latest.sensorTypeId.name;
                    const alert = isAlert(name, latest.value);
                    const b = SAFE_BOUNDS[name];
                    return (
                        <div
                            key={latest.sensorTypeId._id}
                            className={`stat-card ${alert ? 'stat-card-alert' : ''} ${selectedSensor === name ? 'stat-card-selected' : ''}`}
                            onClick={() => { setSelectedSensor(name); setActiveTab('chart'); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="stat-icon">{getIcon(name)}</div>
                            <div className="stat-content">
                                <span className="stat-label">{name}</span>
                                <div className={`stat-value ${alert ? 'stat-value-alert' : ''}`}>
                                    {latest.value} <span className="stat-unit">{latest.sensorTypeId.unit}</span>
                                </div>
                                {b ? (
                                    alert
                                        ? <div className="stat-alert-msg"><AlertTriangle size={12} /> Ngưỡng: {b.min} – {b.max}</div>
                                        : <div className="stat-ok-msg">✓ Trong ngưỡng ({b.min} – {b.max})</div>
                                ) : (
                                    <div className="stat-no-bound">— Chưa cài ngưỡng cảnh báo</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Biểu đồ & Bảng */}
            <div className="chart-section card">
                <div className="detail-tabs">
                    <button className={`detail-tab ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>
                        📈 Biểu đồ biến thiên
                    </button>
                    <button className={`detail-tab ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')}>
                        📋 Bảng dữ liệu
                    </button>
                </div>

                {/* Bộ lọc sensor */}
                <div className="sensor-selector">
                    {sensorNames.map(name => {
                        const b = SAFE_BOUNDS[name];
                        const hasAlert = records.filter(r => r.sensorTypeId?.name === name).some(r => isAlert(name, r.value));
                        return (
                            <button
                                key={name}
                                className={`sensor-btn ${selectedSensor === name ? 'active' : ''} ${hasAlert ? 'has-alert' : ''}`}
                                onClick={() => setSelectedSensor(name)}
                            >
                                {hasAlert && <AlertTriangle size={13} />}
                                {name}
                                {!b && <span className="no-bound-tag">chưa có ngưỡng</span>}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'chart' && (
                    <>
                        <div style={{ width: '100%', height: 340 }}>
                            <ResponsiveContainer>
                                <LineChart data={chartData} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, fontSize: 13 }}
                                        formatter={(val, _, props) => [
                                            <span style={{ color: props.payload.alert ? '#e11d48' : '#16a34a', fontWeight: 700 }}>
                                                {val} {props.payload.alert ? '⚠ VƯỢT NGƯỠNG' : '✓ Bình thường'}
                                            </span>,
                                            selectedSensor
                                        ]}
                                    />
                                    {bounds && (
                                        <>
                                            <ReferenceLine y={bounds.max} stroke="#e11d48" strokeDasharray="6 3"
                                                label={{ value: `Max ${bounds.max}`, fill: '#e11d48', fontSize: 12, position: 'right' }} />
                                            <ReferenceLine y={bounds.min} stroke="#f97316" strokeDasharray="6 3"
                                                label={{ value: `Min ${bounds.min}`, fill: '#f97316', fontSize: 12, position: 'right' }} />
                                        </>
                                    )}
                                    <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2}
                                        dot={<CustomDot />} activeDot={{ r: 7 }} name={selectedSensor} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-legend">
                            <span><span className="legend-dot green"></span> Bình thường</span>
                            <span><span className="legend-dot red"></span> Cảnh báo (vượt ngưỡng)</span>
                            {bounds
                                ? <span style={{ color: '#e11d48', fontSize: 12 }}>--- Đường giới hạn ngưỡng</span>
                                : <span style={{ color: '#9ca3af', fontSize: 12 }}>⚠ Sensor này chưa có ngưỡng cảnh báo</span>
                            }
                        </div>
                    </>
                )}

                {activeTab === 'table' && (
                    <div className="records-scroll">
                        <table className="alerts-table">
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Sensor</th>
                                    <th>Giá trị</th>
                                    <th>Ngưỡng an toàn</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.filter(r => r.sensorTypeId?.name === selectedSensor).slice(0, 50).map((r, i) => {
                                    const alert = isAlert(r.sensorTypeId?.name, r.value);
                                    const b = SAFE_BOUNDS[r.sensorTypeId?.name];
                                    return (
                                        <tr key={i} className={alert ? 'alert-row-red' : ''}>
                                            <td className="td-time-small">{new Date(r.recordedAt).toLocaleString('vi-VN')}</td>
                                            <td>
                                                <span className={`sensor-badge ${r.sensorTypeId?.name === 'pH' ? 'bg-purple' : r.sensorTypeId?.name === 'Nhiệt độ' ? 'bg-orange' : 'bg-blue'}`}>
                                                    {r.sensorTypeId?.name}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={alert ? 'value-danger' : 'value-ok'}>
                                                    {r.value} <small>{r.sensorTypeId?.unit}</small>
                                                </span>
                                            </td>
                                            <td className="td-time-small">{b ? `${b.min} – ${b.max}` : <em style={{ color: '#9ca3af' }}>Chưa cài</em>}</td>
                                            <td>
                                                {b ? (
                                                    alert
                                                        ? <span className="status-badge danger"><AlertTriangle size={13} /> Vượt ngưỡng</span>
                                                        : <span className="status-badge ok">✓ Bình thường</span>
                                                ) : (
                                                    <span className="status-badge" style={{ background: '#f3f4f6', color: '#9ca3af' }}>— Không theo dõi</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClusterDetail;
