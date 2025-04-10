import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    // state : menyimpan data di project react
    // login : nama datanya, setLogin

    const [login, setLogin] = useState({ username: '', password: '' });
    const [error, setError] = useState([]);

    // methof untuk memanipulasi yang berhubungan dengan routing
    let navigate = useNavigate();

    function loginProcess(e) {
        e.preventDefault(); //mengambil alih fungsi 
        axios.post('http://45.64.100.26:88/API-Lumen/public/login', login)
            .then(res => {
                console.log(res.data);
                // ketika berhasil login, simpan data token dan user di localstorage
                localStorage.setItem("access_token", res.data.data.access_token);
                // JSON.stringify mengubah json menjadi string, localstorage hanya bisa disimpan string
                localStorage.setItem("user", JSON.stringify(res.data.data.user));
                // urutan tidak 
                navigate("/dashboard");
        })
        .catch(err => {
            setError(err.response.data);
            // console.log(err.response.data);
        })
    }


    return (
        <div className="d-flex justify-content-center align-items-center mt-5" onSubmit={(e) => loginProcess(e)}>
            <div className="card shadow-lg p-5" style={{ maxWidth: '100%', width: '100%', borderRadius: '7px', border: 'none' }}>
                <div className="card-body">
                    <h3 className="text-center mb-4 fw-bold" style={{ color: '#393E46' }}>Sign In</h3>
                    <form>
                        <div className="mb-3">
                            {
                                // object.keys(error).length : mengecek jika objeck state error pada isisnya   
                                Object.entries(error).length > 0 ? (
                                    <div className="alert alert-danger">
                                        <ol className="alert alert-danger m-2 p-2">
                                            {/* kalau data error tapi ada isinya lebih dari 0, looping isinya kalau gaada munculin yang bagian message, error.data perlu menggunakan object.entries karena bentuknya (li), error.message tdk perlu menggunakan karena bentuknya */}
                                            {
                                                Object.entries(error.data).length > 0 ?
                                                Object.entries(error.data).map(([key, value]) => (
                                                    <li>{value}</li>
                                                )) : error.message
                                            }
                                        </ol>
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
                        <button type="submit" className="btn w-100 py-2 fw-bold" style={{ backgroundColor: '#00ADB5', color: 'white' }}>Login</button>
                        <div className="text-center mt-3">
                            <a href="#" className="text-decoration-none text-opacity-75" style={{ color: '#393E46' }}>Forgot password?</a>
                        </div>
                        <div className="text-center mt-3">
                            <span className="text-muted">Don’t have an account? </span>
                            <a href="#" className="text-decoration-none" style={{ color: '#00ADB5' }}>Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}