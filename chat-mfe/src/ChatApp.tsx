
import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import "./chatStyles.css";
import createAPI from "./api";
import CreateRoomModal from "./components/CreateRoomModal";

interface Message {
    id: string;
    roomId: string;
    sender: string;
    content: string;
    timestamp: string;
    senderId?: any; // populated
}

interface Room {
    _id: string;
    name: string;
    protected: boolean;
}

interface ChatAppProps {
    user?: any;
    token?: string;
}

const SOCKET_URL = "http://localhost:3000";

const ChatApp: React.FC<ChatAppProps> = ({ user, token }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [passwordPrompt, setPasswordPrompt] = useState<string | null>(null); // Room ID waiting for password
    const [passwordInput, setPasswordInput] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Rooms
    const fetchRooms = async () => {
        if (!token) return;
        try {
            const api = createAPI(token);
            const { data } = await api.get("/rooms");
            setRooms(data);
            if (data.length > 0 && !currentRoom) {
                // checking if general exists or just pick first
                const general = data.find((r: Room) => r.name === "general");
                if (general) handleJoinRoom(general);
            }
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [token]);

    // Socket Connection
    useEffect(() => {
        if (!user || !token) return;

        const newSocket = io(SOCKET_URL, {
            auth: { token }
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to backend");
            // Join current room if any
            if (currentRoom) {
                newSocket.emit("joinRoom", currentRoom._id);
            }
        });

        newSocket.on("newMessage", (message: Message) => {
            if (currentRoom && message.roomId === currentRoom._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, token]); // Re-connect only if user/token changes.

    // Join Room Effect (Socket)
    useEffect(() => {
        if (socket && currentRoom) {
            socket.emit("joinRoom", currentRoom._id);
            // Fetch messages for room
            const fetchMessages = async () => {
                try {
                    const api = createAPI(token);
                    const { data } = await api.get(`/rooms/${currentRoom._id}/messages`);
                    setMessages(data);
                } catch (error) {
                    console.error("Failed to fetch messages", error);
                }
            };
            fetchMessages();
        }
    }, [currentRoom, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleJoinRoom = async (room: Room, password?: string) => {
        if (room.protected && !password) {
            setPasswordPrompt(room._id);
            setPasswordInput("");
            return;
        }

        try {
            if (room.protected) {
                const api = createAPI(token);
                await api.post("/rooms/join", { roomId: room._id, password });
            }
            setCurrentRoom(room);
            setPasswordPrompt(null);
        } catch (error) {
            alert("Invalid Password or Failed to join");
        }
    };

    const sendMessage = () => {
        if (socket && input.trim() && currentRoom && user) {
            const msgData = {
                roomId: currentRoom._id,
                content: input,
                sender: user.username,
            };
            // Optimistic update? No, wait for event for consistent ID or just wait.
            // But we need to emit.
            socket.emit("sendMessage", msgData);
            setInput("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    if (!user) {
        return <div className="chat-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Please Login to Chat</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h3 className="sidebar-title">Channels</h3>
                    <button className="add-room-btn" onClick={() => setShowCreateModal(true)} title="Create Room">
                        +
                    </button>
                </div>
                <ul className="room-list">
                    {rooms.map((room) => (
                        <li
                            key={room._id}
                            className={`room-item ${currentRoom?._id === room._id ? "active" : ""}`}
                            onClick={() => handleJoinRoom(room)}
                        >
                            <span># {room.name}</span>
                            {room.protected && <span className="lock-icon">🔒</span>}
                        </li>
                    ))}
                </ul>
            </div>


            <div className="chat-main">
                {currentRoom ? (
                    <>
                        {/* Channel Header (add this for pro look) */}
                        <div style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '600',
                            zIndex: 10,
                            boxShadow: '0 1px 0 rgba(4,4,5,0.02)'
                        }}>
                            <span style={{ fontSize: '1.2rem', color: '#B5BAC1' }}>#</span>
                            {currentRoom.name}
                        </div>

                        <div className="messages-area">
                            {messages.map((msg) => {
                                const isMe = msg.sender === user.username;
                                return (
                                    <div key={msg.id || Math.random()} className={`message-wrapper ${isMe ? "me" : "them"}`}>
                                        <div className="message-content">
                                            <div className="message-header">
                                                <span className="sender-name">{msg.sender}</span>
                                                <span className="timestamp">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <div className={`message-bubble ${isMe ? "blue" : "gray"}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="input-area">
                            <div className="chat-input-wrapper">
                                <button className="add-room-btn" style={{ fontSize: '1.2rem' }}>+</button>
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder={`Message #${currentRoom.name}`}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button className={`send-btn ${input.trim() ? 'active' : ''}`} onClick={sendMessage}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="messages-area" style={{ alignItems: 'center', justifyContent: 'center', color: '#b5bac1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ fontSize: '3rem' }}>👋</div>
                        <h3>Welcome to Box Chat</h3>
                        <p>Select a channel from the sidebar to start talking.</p>
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <CreateRoomModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={fetchRooms}
                    token={token || ""}
                />
            )}

            {/* Password Prompt Modal */}
            {passwordPrompt && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Locked Room</h3>
                        <div className="form-group">
                            <label>Password Required</label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setPasswordPrompt(null)}>Cancel</button>
                            <button className="btn-primary" onClick={() => {
                                const room = rooms.find(r => r._id === passwordPrompt);
                                if (room) handleJoinRoom(room, passwordInput);
                            }}>Join Room</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatApp;

