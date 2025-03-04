import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Template from "../layouts/Template";
// import Home from "../pages/Home";

export const router = createBrowserRouter([
    { 
        path: "/",
        element: <Template />,
        children: [
            { path: "/", element: <App /> },
            { path: "/login", element: <Login /> },
        ]
    }
])