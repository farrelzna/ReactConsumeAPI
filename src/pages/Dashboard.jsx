import React, { useState, useEffect } from "react";
import { API_URL } from "../constant";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalItems: 0,
        totalStock: 0,
        totalInbound: 0,
        totalDefective: 0,
        recentActivities: []
    });
    const [user, setUser] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_URL}/stuffs`);
            const items = response.data.data;
            const totalItems = items.length;
            const totalStock = items.reduce((sum, item) =>
                sum + (item.stuff_stock?.total_available || 0), 0);
            const totalDefective = items.reduce((sum, item) =>
                sum + (item.stuff_stock?.total_defec || 0), 0);


            setStats({
                totalItems,
                totalStock,
                totalDefective,
                totalInbound: 0, // Placeholder for total inbound
                recentActivities: items.slice(0, 5)
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const calculatePercentage = (value, total) => {
        if (!total) return 0;
        return Math.min(Math.round((value / total) * 100), 100);
    };

    const StatsCard = ({ icon, color, title, value, maxValue, isPercentage }) => {
        const percentage = calculatePercentage(value, maxValue);

        return (
            <div className="col-xl-3 col-sm-6">
                <div className="card bg-gradient shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <div className="d-flex align-items-center">
                                <div className={`rounded-circle bg-${color} bg-opacity-10 me-3`} style={{ padding: "10px 15px 10px 15px" }}>
                                    <i className={`bi ${icon} text-${color}`}></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 text-muted">{title}</h6>
                                    <h4 className="mb-0 fw-bold">
                                        {isPercentage ? `${value}%` : value.toLocaleString()}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className={`progress bg-${color} bg-opacity-10`} style={{ height: "4px" }}>
                            <div
                                className={`progress-bar bg-${color}`}
                                style={{ width: `${percentage}%` }}
                                title={`${percentage}% of ${maxValue.toLocaleString()}`}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchDashboardData();
        fetchUserData();
    }, []);

    return (
        <div className="container">
            {/* Welcome Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="mb-0">Welcome back!</h4>
                            <p className="text-muted">Here's what's happening with your inventory today.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <StatsCard
                    icon="bi-box"
                    color="primary"
                    title="Total Items"
                    value={stats.totalItems}
                    maxValue={stats.totalItems}
                />
                <StatsCard
                    icon="bi-boxes"
                    color="success"
                    title="Total Stock"
                    value={stats.totalStock}
                    maxValue={stats.totalStock + stats.totalDefective}
                />
                <StatsCard
                    icon="bi-exclamation-triangle"
                    color="danger"
                    title="Total Defective"
                    value={stats.totalDefective}
                    maxValue={stats.totalStock + stats.totalDefective}
                />
                <StatsCard
                    icon="bi-heart"
                    color="info"
                    title="Stock Health"
                    value={stats.totalInbound}
                    maxValue={stats.totalStock + stats.totalDefective}
                />
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">Latest Items</h5>
                    {user?.role === 'admin' && (
                        <div className="d-flex gap-2">
                            <Link
                                className="btn btn-dark btn-sm px-3 d-flex align-items-center gap-2"
                                to={"/dashboard/stuffs"}
                            >
                                <span>See More</span>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 px-4">Items</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4">Stock Available</th>
                                    <th className="py-3 px-4">Stock Defective</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivities.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-3 px-4 fw-semibold">{item.name}</td>
                                        <td className="py-3 px-4 fw-semibold" >{item.type}</td>
                                        <td className="py-3 px-4">
                                            <span className="badge bg-success bg-opacity-10 text-success px-3" style={{ width: "100px" }}>
                                                {item.stuff_stock?.total_available || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="badge bg-danger bg-opacity-10 text-danger px-3" style={{ width: "100px" }}>
                                                {item.stuff_stock?.total_defec || 0}
                                            </span>
                                        </td>
                                        <td className="py- px-4">
                                            {item.stuff_stock?.total_available > 0 ? (
                                                <button className="btn btn-soft-success btn-outline-success btn-sm" style={{ width: "150px" }}>In Stock</button>
                                            ) : (
                                                <button className="btn btn-soft-danger btn-outline-danger btn-sm" style={{ width: "150px" }}>Out of Stock</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentActivities.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                            No items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
}