import React from "react";
import dayjs from "dayjs";

export default function Profile() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    return (
        // <div className="container mt-5 mb-5">
        //     <div className="row d-flex justify-content-between">
        //         <div className="col-md-3 border-right rounded bg-white shadow-sm">
        //             <div className="d-flex flex-column align-items-center text-center p-3 py-5">
        //                 {localStorage.getItem("user") ? (
        //                     <>
        //                         <img
        //                             className="rounded-circle"
        //                             width="150px"
        //                             src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
        //                             alt="Profile"
        //                         />
        //                         <span className="font-weight-bold">
        //                             {user.username || "N/A"}
        //                         </span>
        //                         <span className="text-black-50">
        //                             {user.email || "N/A"}
        //                         </span>
        //                         <span className="text-muted">
        //                             {user.role || "N/A"}
        //                         </span>
        //                         <span className="text-success fw-bold">Status: Active</span>
        //                     </>
        //                 ) : (
        //                     <p>Anda belum login</p>
        //                 )}
        //             </div>
        //         </div>

        //         <div className="col-md-8 border-right rounded bg-white shadow-sm d-flex justify-content-center">
        //             <div className="p-2 py-5">
        //                 <div className="align-items-center">
        //                     <h4 className="mb-">Profile Details</h4>
        //                 </div>
        //                 <div className="row mt-5">
        //                     <div className="col-md-6">
        //                         <p><strong>User ID:</strong> {user.id || "N/A"}.</p>
        //                         <p><strong>Username:</strong> {user.username || "N/A"}</p>
        //                         <p><strong>Email:</strong> {user.email || "N/A"}</p>
        //                         <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
        //                     </div>
        //                     <div className="col-md-6">
        //                         <p><strong>Role:</strong> {user.role || "N/A"}</p>
        //                         <p><strong>Status:</strong> Active</p>
        //                         <p><strong>Join Date:</strong> {dayjs(user.created_at).format("DD MMMM YYYY")}</p>
        //                         <p><strong>Address:</strong> Jl. Mawar No. 10, Jakarta</p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="container mt-5 mb-5">
            <div className="d-flex flex-wrap gap-3 justify-content-between">

                {/* Sidebar Kiri */}
                <div className="card shadow-sm p-4" style={{ width: '280px' }}>
                    <div className="text-center">
                        <img
                            className="rounded-circle mb-3"
                            width="120"
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Profile"
                        />
                        <h5 className="fw-bold mb-0">{user.username || "N/A"}</h5>
                        <p className="text-muted">{user.role || "N/A"}</p>
                        <p className="text-muted small">Bay Area, San Francisco, CA</p>
                        <div className="mb-2 d-flex justify-content-center gap-2">
                            <button className="btn btn-sm" style={{ backgroundColor: '#00ADB5', color: 'white' }}>Follow</button>
                            <button className="btn btn-sm" style={{ backgroundColor: 'transparent', color: '#00ADB5', border: '1px solid #00ADB5'}}>Message</button>
                        </div>
                        <hr />
                        <div className="text-start small">
                            <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center mb-2 text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe me-2" viewBox="0 0 16 16">
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0A6.5 6.5 0 0 0 1.5 8Z" />
                                    <path d="M8 0a8 8 0 0 0 0 16A8 8 0 0 0 8 0Z" />
                                </svg>
                                Website
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center mb-2 text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github me-2" viewBox="0 0 16 16">
                                    <path d="M8 .198a8 8 0 0 0-2.53 15.592c.4.074.547-.174.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.727-.497.055-.487.055-.487.803.056 1.225.824 1.225.824.714 1.223 1.872.87 2.328.665.072-.517.28-.87.508-1.07-1.777-.202-3.644-.888-3.644-3.951 0-.872.31-1.587.823-2.147-.083-.202-.357-1.016.078-2.12 0 0 .672-.215 2.2.82a7.654 7.654 0 0 1 2-.27c.68.003 1.36.092 2 .27 1.527-1.035 2.198-.82 2.198-.82.437 1.104.163 1.918.08 2.12.513.56.822 1.275.822 2.147 0 3.073-1.87 3.746-3.652 3.944.287.247.543.734.543 1.48 0 1.07-.01 1.933-.01 2.197 0 .213.145.462.55.384A8.001 8.001 0 0 0 8 .198Z" />
                                </svg>
                                Github
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center mb-2 text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter me-2" viewBox="0 0 16 16">
                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.009-.422A6.673 6.673 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518A3.301 3.301 0 0 0 15.555 2.3a6.574 6.574 0 0 1-2.084.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.766-3.429 3.286 3.286 0 0 0 1.015 4.381A3.203 3.203 0 0 1 .64 6.575v.041a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.617-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                </svg>
                                Twitter
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center mb-2 text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram me-2" viewBox="0 0 16 16">
                                    <path d="M8 0c2.2 0 2.469.008 3.337.048.869.04 1.46.177 1.99.378.566.214 1.047.5 1.524.978.477.477.764.958.978 1.524.201.53.338 1.121.378 1.99.04.868.048 1.137.048 3.337s-.008 2.469-.048 3.337c-.04.869-.177 1.46-.378 1.99a3.921 3.921 0 0 1-.978 1.524 3.921 3.921 0 0 1-1.524.978c-.53.201-1.121.338-1.99.378C10.469 15.992 10.2 16 8 16s-2.469-.008-3.337-.048c-.869-.04-1.46-.177-1.99-.378a3.921 3.921 0 0 1-1.524-.978 3.921 3.921 0 0 1-.978-1.524c-.201-.53-.338-1.121-.378-1.99C.008 10.469 0 10.2 0 8s.008-2.469.048-3.337c.04-.869.177-1.46.378-1.99a3.921 3.921 0 0 1 .978-1.524A3.921 3.921 0 0 1 2.928.426c.53-.201 1.121-.338 1.99-.378C5.531.008 5.8 0 8 0Zm0 1.6c-2.163 0-2.421.007-3.278.047-.766.037-1.183.165-1.459.274a2.324 2.324 0 0 0-.843.548 2.324 2.324 0 0 0-.548.843c-.109.276-.237.693-.274 1.459C1.607 5.579 1.6 5.837 1.6 8c0 2.163.007 2.421.047 3.278.037.766.165 1.183.274 1.459.123.312.29.58.548.843.263.263.531.43.843.548.276.109.693.237 1.459.274.857.04 1.115.047 3.278.047s2.421-.007 3.278-.047c.766-.037 1.183-.165 1.459-.274a2.324 2.324 0 0 0 .843-.548 2.324 2.324 0 0 0 .548-.843c.109-.276.237-.693.274-1.459.04-.857.047-1.115.047-3.278s-.007-2.421-.047-3.278c-.037-.766-.165-1.183-.274-1.459a2.324 2.324 0 0 0-.548-.843 2.324 2.324 0 0 0-.843-.548c-.276-.109-.693-.237-1.459-.274C10.421 1.607 10.163 1.6 8 1.6ZM8 3.838a4.162 4.162 0 1 0 0 8.324 4.162 4.162 0 0 0 0-8.324ZM8 10.8A2.8 2.8 0 1 1 8 5.2a2.8 2.8 0 0 1 0 5.6Zm4.406-6.6a.96.96 0 1 1-1.922 0 .96.96 0 0 1 1.922 0Z" />
                                </svg>
                                Instagram
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-decoration-none text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook me-2" viewBox="0 0 16 16">
                                    <path d="M8.05 1a7 7 0 1 0 2.4 13.6V9.89H8.64V8.05h1.81V6.52c0-1.8 1.03-2.8 2.62-2.8.76 0 1.55.14 1.55.14v1.7h-.87c-.86 0-1.13.54-1.13 1.1v1.3h1.93l-.31 1.84h-1.62v4.7A7 7 0 0 0 8.05 1z" />
                                </svg>
                                Facebook
                            </a>
                        </div>

                    </div>
                </div>

                {/* Profile Info Tengah */}
                <div className="card shadow-sm p-4 flex-grow-1" style={{ minWidth: '320px', flexBasis: '400px' }}>
                    <h5 className="text-center mb-4" style={{ color: '#393E46' }}>Profile Info</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>User ID:</strong> {user.id || "N/A"}</p>
                            <p><strong>Full Name:</strong> {user.username || "N/A"}</p>
                            <p><strong>Email:</strong> {user.email || "admin@gmail.com"}</p>
                            <p><strong>Phone:</strong> (123) 456-6789</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Address:</strong> Bay Area, San Francisco, CA</p>
                            <p><strong>Join Date:</strong> {dayjs(user.created_at).format("DD MMMM YYYY")}</p>
                        </div>
                    </div>
                </div>

                {/* Card Progress Atas */}
                <div className="card shadow-sm p-4" style={{ width: '320px' }}>
                    <h6 className="mb-3" style={{ color: '#393E46' }}>Assignment: Project Status</h6>
                    {["Web Design", "Website Markup", "One Page", "Mobile Template", "Backend API"].map((title, i) => (
                        <div key={i} className="mb-2">
                            <small className="fw-bold">{title}</small>
                            <div className="progress">
                                <div className="progress-bar" role="progressbar" style={{ width: `${50 + i * 10}%`, color: '#00ADB5' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card Progress Bawah - Full Width */}
            <div className="card shadow-sm p-4 mt-4 w-100">
                <h6 className="mb-3" style={{ color: '#393E46' }}>Assignment: Project Status</h6>
                {["Web Design", "Website Markup", "One Page", "Mobile Template", "Backend API"].map((title, i) => (
                    <div key={i} className="mb-2">
                        <small className="fw-bold">{title}</small>
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${60 + i * 7}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}