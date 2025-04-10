import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivatePage() {
    let authentication = localStorage.getItem("access_token");

    // jika navigate disimpan di function, harus gunakan useNavigate(), jika digunakan di konten HTML gunakan <Navigate />
    // outlet -> element childern routernya
    return authentication ? <Outlet /> : <Navigate to="/login" replace />
}