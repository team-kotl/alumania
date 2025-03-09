import { PiBell } from "react-icons/pi";
import { useState, useEffect } from "react";
import axios from "axios";

const NotificationModal = ({ setNotifOpen }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const userid = localStorage
        .getItem("userid")
        .substring(1, localStorage.getItem("userid").length - 1);

    useEffect(() => {
        const fetchNotifications = async () => {
            await axios
                .get(
                    `http://localhost:2012/notifications/likes?userid=${userid}`
                )
                .then((res) => setNotifications(res.data))
                .then(() => setLoading(false));
        };
        fetchNotifications();
    }, [userid]);

    return (
        <>
            <dialog id="notification_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setNotifOpen((prev) => !prev)}
                        >
                            ✕
                        </button>
                    </form>
                    <div className="flex items-center justify-center gap-2">
                        <PiBell />
                        <h3 className="font-bold text-lg">Notifications</h3>
                    </div>
                    <div className="join join-vertical w-full h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex w-full h-full items-center justify-center">
                                <span className="loading"></span>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div
                                    key={index}
                                    className="flex join w-full border-b last:border-b-0 px-5 py-3 border-gray-200 items-center gap-2"
                                >
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full ring ring-offset-2 ring-secondary ring-offset-base-100">
                                            <img
                                                src={`data:image/png;base64,${notif.displaypic}`}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-gray-600">
                                        {`${notif.fullname} has liked ❤ your post`}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex w-full h-full items-center justify-center text-gray-400 text-2xl">
                                No Notifications yet
                            </div>
                        )}
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default NotificationModal;
