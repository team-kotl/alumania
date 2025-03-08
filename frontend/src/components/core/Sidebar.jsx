// Author: @PEEACHYBEE Freskkie Encarnacion
//         @yukiroow Harry Dominguez
import {
    PiHouse,
    PiMagnifyingGlass,
    PiPlusCircle,
    PiSignOutFill,
    PiUser,
    PiChatCircle,
    PiBellLight,
} from "react-icons/pi";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import NewPostModal from "../post/NewPostModal";
import LogoutModal from "./LogoutModal";

/**
 * The main navigation bar (side) of the application
 */
const SideBar = () => {
    const { logout } = useAuth();
    const [addPost, setAddPost] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const handleLogout = () => {
        document.getElementById("logout_modal").showModal();
    };

    const handleAddPost = () => {
        setAddPost((prev) => !prev);
        document.getElementById("addpost_modal").showModal();
    };
    return (
        <>
            <LogoutModal auth={logout} />
            <NewPostModal handleAddPost={handleAddPost} />
            <nav className="flex flex-col h-screen w-20 items-center py-9 fixed top-0 left-0 z-50">
                <img src={Logo} alt="Logo" className="w-10 h-10" />
                <div className="flex flex-col items-center space-y-9 flex-grow justify-center">
                    <NavLink to="/app/home">
                        {({ isActive }) => (
                            <div className="flex items-center gap-1">
                                {isActive && (
                                    <span className="w-1 h-1 rounded-full bg-primary transition-all"></span>
                                )}
                                <span
                                    className={`text-2xl cursor-pointer ${
                                        isActive
                                            ? "text-[#032543] transition-all translate-x-2"
                                            : "text-[#A29C9C] transition-all hover:text-[#032543]"
                                    }`}
                                >
                                    <PiHouse />
                                </span>
                            </div>
                        )}
                    </NavLink>

                    <NavLink to="/app/chat">
                        {({ isActive }) => (
                            <div className="flex items-center gap-1">
                                {isActive && (
                                    <span className="w-1 h-1 rounded-full bg-primary transition-all"></span>
                                )}
                                <span
                                    className={`text-2xl cursor-pointer ${
                                        isActive
                                            ? "text-primary transition-all translate-x-2"
                                            : "text-[#A29C9C] transition-all hover:text-primary"
                                    }`}
                                >
                                    <PiChatCircle />
                                </span>
                            </div>
                        )}
                    </NavLink>

                    <NavLink to="/app/search">
                        {({ isActive }) => (
                            <div className="flex items-center gap-1">
                                {isActive && (
                                    <span className="w-1 h-1 rounded-full bg-primary transition-all"></span>
                                )}
                                <span
                                    className={`text-2xl cursor-pointer ${
                                        isActive
                                            ? "text-primary transition-all translate-x-2"
                                            : "text-[#A29C9C] transition-all hover:text-primary"
                                    }`}
                                >
                                    <PiMagnifyingGlass />
                                </span>
                            </div>
                        )}
                    </NavLink>

                    <span
                        className={`text-2xl cursor-pointer 
                            ${
                                addPost
                                    ? "text-secondary transition-all translate-x-2 scale-110"
                                    : "text-[#A29C9C] hover:text-primary"
                            }`}
                        onClick={handleAddPost}
                    >
                        <PiPlusCircle />
                    </span>

                    <div className="flex items-center gap-1">
                        {notifOpen && (
                            <span className="w-1 h-1 rounded-full bg-primary transition-all"></span>
                        )}
                        <span
                            className={`text-2xl cursor-pointer ${
                                notifOpen
                                    ? "text-primary transition-all translate-x-2"
                                    : "text-[#A29C9C] transition-all hover:text-primary"
                            }`}
                            onClick={() => setNotifOpen((prev) => !prev)}
                        >
                            <PiBellLight />
                        </span>
                    </div>

                    <NavLink to="/app/profile">
                        {({ isActive }) => (
                            <div className="flex items-center gap-1">
                                {isActive && (
                                    <span className="w-1 h-1 rounded-full bg-primary transition-all"></span>
                                )}
                                <span
                                    className={`text-2xl cursor-pointer ${
                                        isActive
                                            ? "text-primary transition-all translate-x-2"
                                            : "text-[#A29C9C] transition-all hover:text-primary"
                                    }`}
                                >
                                    <PiUser />
                                </span>
                            </div>
                        )}
                    </NavLink>
                    <PiSignOutFill
                        onClick={handleLogout}
                        className="text-2xl text-[#A29C9C] hover:text-[#032543]"
                    />
                </div>
            </nav>
        </>
    );
};

export default SideBar;
