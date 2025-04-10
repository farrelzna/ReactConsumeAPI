import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    let navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("access_token");

    function logoutHandler() {
        // hapus data di localStorage ketika logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand p-4 rounded-pill shadow-sm sticky-top bg-white">
            <div className="container-fluid">
                {/* <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    >
                    <span className="navbar-toggler-icon" />
                    </button> */}
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link active    " to="/">
                            My Inventory
                        </Link>
                        {!isLoggedIn ? (
                            <Link className="nav-link active" aria-current="page" to="/login">
                                Login
                            </Link>
                        ) : (
                            <>
                            <Link className="nav-link active" aria-current="page" to="/profile">
                                Profile
                            </Link>
                            <Link className="nav-link active" aria-current="page" to="/dashboard">
                                Dashboard
                            </Link>
                            <Link className="nav-link active" aria-current="page" to="/dashboard/stuffs">
                                Stuffs
                            </Link>
                            <a className="nav-link active" aria-current="page" href="#" onClick={logoutHandler}>
                                Logout
                            </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}