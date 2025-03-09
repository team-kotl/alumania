import { PiChat } from "react-icons/pi";
import { useState, useEffect } from "react";
import axios from "axios";

const NewChatModal = ({ ws, userId, onNewChat }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search
    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                try {
                    const res = await axios.get(
                        `http://localhost:2012/chat/search?search=${searchQuery}`
                    );
                    setSearchedUsers(res.data);
                } catch (error) {
                    console.error("Search error:", error);
                }
                setIsSearching(false);
            }
        };

        searchUsers();
    }, [searchQuery]);

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedUser) return;

        try {
            ws.emit("sendMessage", {
                senderId: userId,
                recipientId: selectedUser.userid,
                message: message,
                isNew: true,
            });

            // Close modal and reset state
            document.getElementById("new_chat_modal").close();
            setMessage("");
            setSelectedUser(null);

            // Trigger parent callback
            onNewChat();
        } catch (error) {
            console.error("Send message error:", error);
        }
    };

    return (
        <dialog id="new_chat_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <span className="flex items-center gap-2 mb-4">
                    <PiChat />
                    <h3 className="font-bold text-lg">New Chat</h3>
                </span>

                {/* Search Input */}
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Search Results */}
                {isSearching ? (
                    <div className="text-center p-4">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : (
                    searchedUsers.length > 0 && (
                        <div className="menu mt-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
                            {searchedUsers.map((user) => (
                                <li key={user.userid}>
                                    <button
                                        className="flex items-center gap-2 p-3 hover:bg-base-200"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img
                                                    src={`data:image/png;base64,${user.displaypic}`}
                                                />
                                            </div>
                                        </div>
                                        <span>{user.fullname}</span>
                                    </button>
                                </li>
                            ))}
                        </div>
                    )
                )}

                {/* Selected User & Message Input */}
                {selectedUser && (
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        src={`data:image/png;base64,${selectedUser.displaypic}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    @{selectedUser.fullname}
                                </p>
                            </div>
                        </div>

                        <div className="form-control">
                            <textarea
                                className="textarea textarea-bordered h-24 w-full"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setSelectedUser(null);
                                    setMessage("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}

                {/* Fallback for no results */}
                {!isSearching && searchedUsers.length === 0 && searchQuery && (
                    <div className="text-center p-4 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default NewChatModal;
