// Author: @yukiroow Harry Dominguez
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ErrorPage from "./pages/ErrorPage";
import SearchPage from "./pages/SearchPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import EventsPage from "./pages/EventsPage";
import JobsPage from "./pages/JobsPage";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import HomeLayout from "./layouts/HomeLayout";
import ChatPage from "./pages/ChatPage"
import { ProtectedRoute } from "./components/core/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

/**
 * The main file renders all the components in the index.html file in the root directory
 * The routing and route protection is applied here.
 */
createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route index element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                </Route>
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <RootLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="home" element={<HomeLayout />}>
                        <Route
                            path="experiences"
                            element={<ExperiencesPage />}
                        />
                        <Route path="events" element={<EventsPage />} />
                        <Route path="opportunities" element={<JobsPage />} />
                    </Route>
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
