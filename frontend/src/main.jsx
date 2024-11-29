import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<AuthLayout />}>
                        <Route index element={<LoginPage />} />
                        <Route path="signup" element={<SignupPage />} />
                    </Route>
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <RootLayout />
                        </ProtectedRoute>
                    }>
                        {/* TODO: Site Pages */} 
                    </Route>
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
