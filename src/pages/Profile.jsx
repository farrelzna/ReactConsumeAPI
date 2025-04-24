import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
    HiUser, HiMail, HiIdentification, HiCalendar, HiUserGroup, HiCheck,
    HiClipboardList, HiCube, HiChartBar, HiPencil
} from "react-icons/hi";
import axios from "axios";
import { API_URL } from "../constant";


export default function Profile() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    const [stats, setStats] = useState({
        totalItems: 0,
        totalStock: 0,
        totalDefective: 0,
        recentActivities: []
    });

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

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header mb-4">
                <div className="profile-cover"></div>
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Profile"
                        />
                    </div>
                    <div className="profile-info">
                        <h4 className="bg-white rounded-4 border-bottom" style={{ padding: "20px 200px 20px 20px"}}>{user?.username || "N/A"}</h4>
                        <span className="profile-role">{user?.role || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Stats Cards */}
                <div className="col-12 col-lg-3">
                    <div className="profile-stats-wrapper">
                        <div className="stats-card">
                            <div className="stats-icon bg-primary-subtle">
                                <HiCube className="text-primary" size={24} />
                            </div>
                            <div className="stats-info">
                                <h3>{stats.totalStock.toLocaleString()}</h3>
                                <p>Total Items</p>
                            </div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-icon bg-success-subtle">
                                <HiClipboardList className="text-success" size={24} />
                            </div>
                            <div className="stats-info">
                                <h3>{stats.total}</h3>
                                <p>Total Inbound</p>
                            </div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-icon bg-info-subtle">
                                <HiChartBar className="text-info" size={24} />
                            </div>
                            <div className="stats-info">
                                <h3>{stats.totalStock ?
                                    Math.round((stats.totalStock / (stats.totalStock + stats.totalDefective)) * 100)
                                    : 0}%</h3>
                                <p>Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="col-12 col-lg-9">
                    <div className="card profile-details">
                        <div className="card-header">
                            <h5>Profile Information</h5>
                            <button className="btn btn-primary btn-sm">
                                <HiPencil size={16} className="me-2" />
                                Edit Profile
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="info-item">
                                        <HiUser className="info-icon" />
                                        <div>
                                            <label>Full Name</label>
                                            <p>{user?.username || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="info-item">
                                        <HiMail className="info-icon" />
                                        <div>
                                            <label>Email Address</label>
                                            <p>{user?.email || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="info-item">
                                        <HiUserGroup className="info-icon" />
                                        <div>
                                            <label>Role</label>
                                            <p>{user?.role || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="info-item">
                                        <HiIdentification className="info-icon" />
                                        <div>
                                            <label>User ID</label>
                                            <p>{user?.id || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="info-item">
                                        <HiCalendar className="info-icon" />
                                        <div>
                                            <label>Join Date</label>
                                            <p>{dayjs(user?.created_at).format("DD MMMM YYYY")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="info-item">
                                        <HiCheck className="info-icon" />
                                        <div>
                                            <label>Status</label>
                                            <p><span className="badge bg-success-subtle text-success px-3">Active</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="card shadow-sm border-0 mt-4">
                <div className="card-header d-flex justify-content-between rounded align-items-center">
                    <h5 className="mb-0">Recent Activities</h5>
                    <div className="dropdown">
                        <button className="btn btn-light btn-sm dropdown-toggle">
                            All Activities
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="activity-timeline">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-dot"></div>
                                <div className="activity-content">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">Added new stock</h6>
                                        <span className="text-muted small">
                                            {dayjs().subtract(index, 'day').format("DD MMM YYYY")}
                                        </span>
                                    </div>
                                    <p className="text-muted mb-0">Added 5 new Laptop Acer to inventory</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}