import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, MapPin, Activity } from 'lucide-react';

function Dashboard() {
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            fetch('http://localhost:5000/api/clusters')
                .then(res => res.json())
                .then(data => {
                    setClusters(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Lỗi khi fetch API:', err);
                    setLoading(false);
                });
        };

        // Load data ngay lập tức
        loadData();

        // Auto-refresh sau mỗi 5 giây (5000ms)
        const interval = setInterval(() => {
            loadData();
        }, 5000);

        // Dọn dẹp interval khi huỷ component
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-view">
            <div className="section-header">
                <h2><LayoutGrid size={20} /> Danh sách Cụm cảm biến</h2>
                <p>Chọn một cụm để xem chi tiết thông số môi trường cập nhật theo thời gian thực.</p>
            </div>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="clusters-grid">
                    {clusters.length === 0 ? (
                        <div className="empty-state">
                            <p>Chưa có cụm cảm biến nào trong CSDL.</p>
                        </div>
                    ) : (
                        clusters.map(cluster => (
                            <Link to={`/cluster/${cluster._id}`} className="card cluster-card" key={cluster._id}>
                                <div className="card-header">
                                    <h3>Cụm {cluster.name || 'Không tên'}</h3>
                                    <span className="badge">{cluster.type}</span>
                                </div>

                                <div className="cluster-meta">
                                    <div className="meta-item">
                                        <MapPin size={16} />
                                        <span>{cluster.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Activity size={16} />
                                        <span>{cluster.sensors ? cluster.sensors.length : 0} loại cảm biến</span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <span className="btn-link">Xem chi tiết &rarr;</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
