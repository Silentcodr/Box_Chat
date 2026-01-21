import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import "./presenceStyles.css";

interface User {
    id: string;
    username: string;
    online: boolean;
}

const SOCKET_URL = "http://localhost:3000";

const PresenceWidget: React.FC<{ fullPage?: boolean }> = ({ fullPage }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        // Join with a random username just for tracking presence (if not already handled by auth)
        // For this demo, we assume the host app handles auth, but since this is isolated
        // we'll just listen for the user list.
        // In a real app, we'd pass the auth token or user info via props.

        socket.emit("join", "Observer_" + Math.floor(Math.random() * 100));

        socket.on("userList", (data: User[]) => {
            setUsers(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className={`presence-container ${fullPage ? 'full-page' : 'widget'}`}>
            <div className="presence-header">
                <h3>Online Users</h3>
                <span className="count-badge">{users.filter(u => u.online).length}</span>
            </div>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.id} className="user-item">
                        <div className="avatar-circle">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="username">{user.username}</span>
                            <span className="status-text">{user.online ? "Online" : "Offline"}</span>
                        </div>
                        <div className={`status-indicator ${user.online ? "online" : "offline"}`}></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PresenceWidget;
