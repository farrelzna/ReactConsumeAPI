import axios from "axios";
import React from "react";
import { useState } from "react";

export default function Login() {
    // state : menyimpan data di project react
    // login : nama datanya, setLogin
    const [login, setLogin] = useState({ username: '', password: '' });

    function loginProcess(e) {
        e.preventDefault(); //mengambil alih fungsi 
        axios.post('http://localhost:2222/login', login)
            .then(res => {
                console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" onSubmit={(e) => loginProcess(e)}>
            <div className="card shadow-lg p-5" style={{ maxWidth: '450px', width: '100%', borderRadius: '16px', border: 'none' }}>
                <div className="card-body">
                    <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back</h3>
                    <form>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                                <input type="text" id="username" className="form-control" placeholder="Enter your email" onChange={(e) => setLogin({ ...login, username: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                                <input type="password" id="password" className="form-control" placeholder="Enter your password" onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
                        <div className="text-center mt-3">
                            <a href="#" className="text-decoration-none text-primary">Forgot password?</a>
                        </div>
                        <div className="text-center mt-3">
                            <span className="text-muted">Don’t have an account? </span>
                            <a href="#" className="text-decoration-none text-success">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}