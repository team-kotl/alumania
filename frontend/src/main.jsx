import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <LoginPage />,
//         errorElement: <ErrorPage />,
//     },
//     {
//         path: "/signup",
//         element: <SignupPage />,
//     },
// ]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* <RouterProvider router={router} /> */}
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route index element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                </Route>
                <Route path="/home" element={<RootLayout />}>
                {/* TODO: Homepage Routing */}
                </Route>

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
