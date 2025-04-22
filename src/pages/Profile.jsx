import React from "react";
import dayjs from "dayjs";

export default function Profile() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex flex-wrap gap-3">
                {/* User Profile Card */}
                <div className="card shadow-sm p-4" style={{ width: '300px' }}>
                    <div className="text-center">
                        <img
                            className="rounded-circle mb-3"
                            width="120"
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Profile"
                        />
                        <h5 className="fw-bold mb-1">{user?.username || "N/A"}</h5>
                        <span className="badge bg-primary mb-3">{user?.role || "N/A"}</span>
                        <p className="text-muted small mb-3">
                            <i className="bi bi-clock me-1"></i>
                            Member since {dayjs(user?.created_at).format("MMMM YYYY")}
                        </p>
                        <hr />
                        <div className="d-flex justify-content-around mb-3">
                            <div className="text-center">
                                <h6 className="fw-bold mb-0">150</h6>
                                <small className="text-muted">Items</small>
                            </div>
                            <div className="text-center">
                                <h6 className="fw-bold mb-0">28</h6>
                                <small className="text-muted">Activities</small>
                            </div>
                            <div className="text-center">
                                <h6 className="fw-bold mb-0">95%</h6>
                                <small className="text-muted">Success</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Details Card */}
                <div className="card shadow-sm p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Profile Details</h5>
                        <button className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-pencil me-2"></i>
                            Edit Profile
                        </button>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Full Name</label>
                                <p className="mb-0 fw-medium">{user?.username || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Email Address</label>
                                <p className="mb-0 fw-medium">{user?.email || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Role</label>
                                <p className="mb-0 fw-medium">{user?.role || "N/A"}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="text-muted small mb-1">User ID</label>
                                <p className="mb-0 fw-medium">{user?.id || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Join Date</label>
                                <p className="mb-0 fw-medium">
                                    {dayjs(user?.created_at).format("DD MMMM YYYY")}
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small mb-1">Status</label>
                                <p className="mb-0">
                                    <span className="badge bg-success">Active</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Card */}
            <div className="card shadow-sm p-4 mt-4">
                <h5 className="mb-4">Recent Activities</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Activity</th>
                                <th>Item</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{dayjs().format("DD MMM YYYY")}</td>
                                <td>Added new stock</td>
                                <td>Laptop Acer</td>
                                <td><span className="badge bg-success">Success</span></td>
                            </tr>
                            <tr>
                                <td>{dayjs().subtract(1, 'day').format("DD MMM YYYY")}</td>
                                <td>Updated item</td>
                                <td>Printer HP</td>
                                <td><span className="badge bg-info">Updated</span></td>
                            </tr>
                            <tr>
                                <td>{dayjs().subtract(2, 'day').format("DD MMM YYYY")}</td>
                                <td>Deleted item</td>
                                <td>Mouse Logitech</td>
                                <td><span className="badge bg-danger">Deleted</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}