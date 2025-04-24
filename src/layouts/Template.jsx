import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Template() {
    return (
        <div className="d-flex flex-column flex-md-row py-4" style={{ backgroundColor: "#f5f7fa" }}>
            <Sidebar />
            <main className="main-content flex-grow-1">
                <Outlet />
            </main>
        </div>
    );
}