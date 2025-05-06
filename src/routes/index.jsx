import { createBrowserRouter, Routes } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import StuffIndex from "../pages/stuffs/Index";
import InboundIndex from "../pages/stuffs/inbound";
import Lendings from "../pages/lendings/Index";
import LendingData from "../pages/lendings/data";

import Template from "../layouts/Template";
import PrivatePage from "../pages/middleware/PrivatePage";
import GuestPage from "../pages/middleware/GuestPage";
import AdminRoute from "../pages/middleware/AdminRoute";
import StaffRoute from "../pages/middleware/StaffRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Template />,
        children: [
            { path: "/", element: <App /> },
            {
                path: "/login",
                element: <GuestPage />,
                children: [
                    { path: "", element: <Login /> },
                ]
            },
            {
                path: "",
                element: <PrivatePage />,
                // route pada childern, route ynag bisa di batasi aksesnya
                children: [
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "profile", element: <Profile /> },
                    {
                        path: 'admin',
                        element: <AdminRoute />,
                        children: [
                            { path: "stuffs", element: <StuffIndex /> },
                            { path: "inbound", element: <InboundIndex /> },
                        ]
                    },
                    {
                        path: 'staff',
                        element: <StaffRoute />,
                        children: [
                            { path: "lendings", element: <Lendings /> },
                            { path: "lendings/data", element: <LendingData /> },
                        ]
                    }
                ]
            },
        ]
    }
])

