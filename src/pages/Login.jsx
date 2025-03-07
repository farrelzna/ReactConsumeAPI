import React from "react";
import axios from "axios";
import { useState } from "react";

export default function Login() {
    // state : menyimpan data di project react
    // login : nama datanya, setLogin

    const [login, setLogin] = useState({ username: '', password: '' });
    const [error, setError] = useState([]);

    function loginProcess(e) {
        e.preventDefault(); //mengambil alih fungsi 
        axios.post('http://localhost:8000/login', login)
            .then(res => {
                console.log(res.data);
        })
        .catch(err => {
            setError(err.response.data);
            // console.log(err.response.data);
        })
    }


    return (
        <div className="d-flex justify-content-center align-items-center vh-100" onSubmit={(e) => loginProcess(e)}>
            <div className="card shadow-lg p-5" style={{ maxWidth: '550px', width: '100%', borderRadius: '16px', border: 'none' }}>
                <div className="card-body">
                    <h3 className="text-center mb-4 fw-bold">Sign In</h3>
                    <form>
                        <div className="mb-3">
                            {
                                // object.keys(error).length : mengecek jika objeck state error pada isisnya   
                                Object.entries(error).length > 0 ? (
                                    <div className="alert alert-danger">
                                        <ul className=" m-2 p-2">
                                            {
                                                Object.entries(error.data).map(([key, value]) => (
                                                    <li key={key}>{value}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ) : ''
                            }
                            <label className="form-label fw-semibold d-flex justify-content-start">Username</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                                <input type="text" id="username" className="form-control" placeholder="Enter your email" onChange={(e) => setLogin({ ...login, username: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold d-flex justify-content-start">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                                <input type="password" id="password" className="form-control" placeholder="Enter your password" onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
                        <div className="text-center mt-3">
                            <a href="#" className="text-decoration-none text-primary text-opacity-75">Forgot password?</a>
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