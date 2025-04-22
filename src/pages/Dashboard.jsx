import React, { useState, useEffect } from "react";
import { API_URL } from "../constant";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalItems: 0,
        totalStock: 0,
        totalDefective: 0,
        recentActivities: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_URL}/stuffs`);
            const items = response.data.data;
            const totalItems = items.length;
            const totalStock = items.reduce((sum, item) => sum + (item.stuff_stock?.total_available || 0), 0);
            const totalDefective = items.reduce((sum, item) => sum + (item.stuff_stock?.total_defec || 0), 0);

            setStats({
                totalItems,
                totalStock,
                totalDefective,
                recentActivities: items.slice(0, 5) // Get 5 most recent items
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div className="container py-5">
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
                <div className="col-xl-3 col-sm-6">
                    <div className="card bg-gradient shadow-lg border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                        <i className="bi bi-box fs-4 text-primary"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Total Items</h6>
                                        <h4 className="mb-0 fw-bold">
                                            {stats.totalItems.toLocaleString()}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="progress bg-primary bg-opacity-10" style={{ height: "4px" }}>
                                <div
                                    className="progress-bar bg-primary"
                                    style={{ width: `${(stats.totalItems / Math.max(stats.totalItems, 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card bg-gradient shadow-lg border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                                        <i className="bi bi-boxes fs-4 text-success"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Available Stock</h6>
                                        <h4 className="mb-0 fw-bold">
                                            {stats.totalStock.toLocaleString()}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="progress bg-success bg-opacity-10" style={{ height: "4px" }}>
                                <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${(stats.totalStock / (stats.totalStock + stats.totalDefective || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card bg-gradient shadow-lg border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-3">
                                        <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Defective Items</h6>
                                        <h4 className="mb-0 fw-bold">
                                            {stats.totalDefective.toLocaleString()}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="progress bg-danger bg-opacity-10" style={{ height: "4px" }}>
                                <div
                                    className="progress-bar bg-danger"
                                    style={{ width: `${(stats.totalDefective / (stats.totalStock + stats.totalDefective || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card bg-gradient shadow-lg border-0">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-info bg-opacity-10 p-2 me-3">
                                        <i className="bi bi-heart fs-4 text-info"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Stock Health</h6>
                                        <h4 className="mb-0 fw-bold">
                                            {stats.totalStock ?
                                                Math.round((stats.totalStock / (stats.totalStock + stats.totalDefective)) * 100)
                                                : 0}%
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="progress bg-info bg-opacity-10" style={{ height: "4px" }}>
                                <div
                                    className="progress-bar bg-info"
                                    style={{
                                        width: `${stats.totalStock ?
                                            Math.round((stats.totalStock / (stats.totalStock + stats.totalDefective)) * 100)
                                            : 0}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-lg">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">Latest Items</h5>
                    <div className="d-flex gap-2">
                        <Link
                            className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-2"
                            to={"/dashboard/stuffs"}
                        >
                            <span>See More</span>
                        </Link>
                    </div>
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
                                    <th className="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivities.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-3 px-4 fw-semibold">{item.name}</td>
                                        <td className="py-3 px-4 fw-semibold" >{item.type}</td>
                                        <td className="py-3 px-4">
                                            <span className="badge bg-success bg-opacity-10 text-success px-3">
                                                {item.stuff_stock?.total_available || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="badge bg-danger bg-opacity-10 text-danger px-3">
                                                {item.stuff_stock?.total_defec || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {item.stuff_stock?.total_available > 0 ? (
                                                <button className="btn btn-soft-success btn-outline-success btn-sm" style={{ width: "100px" }}>In Stock</button>
                                            ) : (
                                                <button className="btn btn-soft-danger btn-outline-danger btn-sm" style={{ width: "100px" }}>Out of Stock</button>
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