"use client"
import { Link, useNavigate } from "react-router-dom"
import { Bell, User, Menu } from "lucide-react"

const Navbar = () => {

    let navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    function handleLogout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <nav className=" navbar-expand-lg navbar-light d-flex bg-white rounded shadow-sm sticky-top">
            <div className="p-3 rounded-start" style={{ backgroundColor: '#00ADB5', color: '#fff' }}>
                <Link className="navbar-brand fw-bold" to="/">
                    My Inventory
                </Link>
            </div>
            <div className="navbar container-fluid px-4" style={{ color: '#393E46' }}>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <Menu size={20} />
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/dashboard/stuffs">
                                        Inventory
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/dashboard/inbound">
                                        Inbound
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center">
                        {!token ? (
                            <Link className="btn btn-sm btn-primary rounded-pill px-4" to="/login">
                                Login
                            </Link>
                        ) : (
                            <>
                                <div className="dropdown">
                                    <a
                                        className="d-flex align-items-center text-decoration-none dropdown-toggle"
                                        href="#"
                                        role="button"
                                        id="userDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div
                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                                            style={{ width: "32px", height: "32px" }}
                                        >
                                            <User size={16} />
                                        </div>
                                        <span className="d-none d-md-block">Profile</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/profile">
                                                My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/settings">
                                                Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
