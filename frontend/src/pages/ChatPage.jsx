import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { PiMagnifyingGlass } from "react-icons/pi";

const ChatPage = () => {
    const socket = useRef(io("http://localhost:2012"));
    const [selectedRecipient, setSelectedRecipient] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [recipients, setRecipients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const userid =
        localStorage
            .getItem("userid")
            ?.substring(1, localStorage.getItem("userid")?.length - 1) || "";

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch recipients on page load
                const recipientsRes = await axios.get(
                    `http://localhost:2012/chat/recipients?userid=${userid}`
                );
                setRecipients(recipientsRes.data);

                // Connect to WebSocket after initial load
                socket.current = io("http://localhost:2012");

                // Setup WebSocket listeners
                socket.current.on("receiveMessage", handleNewMessage);
                socket.current.emit("join", userid);
            } catch (error) {
                console.error("Initial data load error:", error);
            }
        };

        if (userid) {
            fetchInitialData();
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [userid]);

    const handleNewMessage = (message) => {
        setRecipients((prev) => {
            const recipientId =
                message.senderid === userid
                    ? message.recipientid
                    : message.senderid;

            return prev
                .map((recipient) => {
                    if (recipient.userid === recipientId) {
                        return {
                            ...recipient,
                            last_message: message.message,
                            last_message_time: message.timesent,
                            unread_count:
                                message.recipientid === userid
                                    ? recipient.unread_count + 1
                                    : recipient.unread_count,
                        };
                    }
                    return recipient;
                })
                .sort(
                    (a, b) =>
                        new Date(b.last_message_time) -
                        new Date(a.last_message_time)
                );
        });

        if (
            selectedRecipient?.userid === message.senderid ||
            selectedRecipient?.userid === message.recipientid
        ) {
            setMessages((prev) => [...prev, message]);
        }
    };

    const fetchRecipients = async () => {
        try {
            const res = await axios.get(
                `http://localhost:2012/chat/recipients?userid=${userid}`
            );
            setRecipients(res.data);
        } catch (error) {
            console.error("Error fetching recipients:", error);
        }
    };

    const handleRecipientClick = async (recipient) => {
        setSelectedRecipient(recipient);

        // Mark messages as read
        await axios.put("http://localhost:2012/chat/messages/read", {
            userId: userid,
            recipientId: recipient.userid,
        });

        // Refresh recipients to clear unread count
        fetchRecipients();

        // Load messages
        const res = await axios.get(
            `http://localhost:2012/chat?senderid=${userid}&recipientid=${recipient.userid}`
        );
        setMessages(res.data);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedRecipient) return;

        setNewMessage("");

        // Send via WebSocket
        socket.current.emit("sendMessage", {
            senderId: userid,
            recipientId: selectedRecipient.userid,
            message: newMessage,
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <main className="flex w-full h-screen items-center justify-center">
            <div className="flex flex-row w-[calc(100%-10rem)] h-[calc(100vh-7rem)] border rounded-3xl border-gray-200 bg-white">
                {/* Recipients List */}
                <div className="min-w-[25%] w-[25%] border-r border-gray-200 flex flex-col">
                    <div className="flex items-center rounded-tl-3xl h-15 border-b border-gray-200 px-4 py-2">
                        <PiMagnifyingGlass className="w-5 h-5 text-gray-400" />
                        <input
                            className="input bg-transparent w-full text-gray-700 focus:outline-none border-none"
                            placeholder="Search chats"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {recipients.map((recipient) => (
                            <div
                                key={recipient.userid}
                                onClick={() => handleRecipientClick(recipient)}
                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                                    selectedRecipient?.userid ===
                                    recipient.userid
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <div className="avatar relative">
                                    <div className="w-12 rounded-full">
                                        <img
                                            src={`data:image/png;base64,${recipient.displaypic}`}
                                        />
                                    </div>
                                    {recipient.unread_count > 0 && (
                                        <span className="absolute -top-1 -right-1 badge badge-primary rounded-full">
                                            {recipient.unread_count}
                                        </span>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 truncate">
                                        {recipient.fullname}
                                    </h3>
                                    <p
                                        className={`text-sm truncate ${
                                            recipient.unread_count > 0
                                                ? "font-bold"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {recipient.last_message}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(
                                            recipient.last_message_time
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="min-w-[75%] w-[75%] flex flex-col">
                    {/* Chat Header */}
                    {selectedRecipient && (
                        <div className="border-b border-gray-200 p-4 flex items-center">
                            <div className="avatar">
                                <div className="w-12 rounded-full">
                                    <img
                                        src={`data:image/png;base64,${selectedRecipient.displaypic}`}
                                    />
                                </div>
                            </div>
                            <h2 className="ml-4 text-lg font-semibold text-gray-800">
                                {selectedRecipient.fullname || "Unknown User"}
                            </h2>
                        </div>
                    )}

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.messageid || msg.timesent}
                                className={`chat ${
                                    msg.senderid === userid
                                        ? "chat-end"
                                        : "chat-start"
                                }`}
                            >
                                <div
                                    className={`chat-bubble ${
                                        msg.senderid === userid
                                            ? "chat-bubble-primary"
                                            : "chat-bubble-secondary"
                                    }`}
                                >
                                    {msg.message}
                                </div>
                                <div className="chat-footer text-xs opacity-50 mt-1">
                                    {new Date(
                                        msg.timesent
                                    ).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    {selectedRecipient && (
                        <div className="border-t border-gray-200 p-4">
                            <div className="join w-full">
                                <input
                                    type="text"
                                    className="input input-bordered join-item w-full"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && sendMessage()
                                    }
                                />
                                <button
                                    className="btn btn-primary join-item"
                                    onClick={sendMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ChatPage;
