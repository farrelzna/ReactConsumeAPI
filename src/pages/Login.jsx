import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiMail, HiLockClosed, HiExclamationCircle } from "react-icons/hi";

export default function Login() {
    const [login, setLogin] = useState({ username: '', password: '' });
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    function loginProcess(e) {
        e.preventDefault();
        axios.post('http://45.64.100.26:88/API-Lumen/public/login', login)
            .then(res => {
                localStorage.setItem("access_token", res.data.data.access_token);
                localStorage.setItem("user", JSON.stringify(res.data.data.user));
                navigate("/dashboard");
            })
            .catch(err => {
                setError(err.response.data);
            });
    }

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <h3>Welcome Back!</h3>
                        <p>Please sign in to continue</p>
                    </div>

                    {Object.keys(error).length > 0 && (
                        <div className="login-alert">
                            <HiExclamationCircle size={20} />
                            <div className="alert-content">
                                {Object.entries(error.data).length > 0 
                                    ? Object.entries(error.data).map(([key, value]) => (
                                        <p key={key}>{value}</p>
                                    ))
                                    : error.message
                                }
                            </div>
                        </div>
                    )}

                    <form onSubmit={loginProcess} className="login-form">
                        <div className="form-group">
                            <label>Username</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <HiMail />
                                </span>
                                <input 
                                    type="text"
                                    placeholder="Enter your username"
                                    onChange={(e) => setLogin({ ...login, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-group">
                                <span className="input-icon">
                                    <HiLockClosed />
                                </span>
                                <input 
                                    type="password"
                                    placeholder="Enter your password"
                                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-button">
                            Sign In
                        </button>

                        <div className="login-footer">
                            <a href="#" className="forgot-password">
                                Forgot password?
                            </a>
                            <p className="signup-text">
                                Don't have an account? <a href="#">Sign Up</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}