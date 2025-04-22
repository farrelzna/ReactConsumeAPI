import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import StuffIndex from "../pages/stuffs/Index";
import InboundIndex from "../pages/inbound/index";

import Template from "../layouts/Template";
import PrivatePage from "../pages/middleware/PrivatePage";
import GuestPage from "../pages/middleware/GuestPage";
// import Home from "../pages/Home";

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
                    { path: "profile", element: <Profile /> }   ,
                    { path: "dashboard/stuffs", element: <StuffIndex /> }, 
                    { path: "dashboard/inbound", element: <InboundIndex /> }, 
                ]
            },  
        ]
    }
])