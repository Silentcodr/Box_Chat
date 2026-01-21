
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./notificationStyles.css";

interface NotificationBadgeProps {
    user?: any;
}

const SOCKET_URL = "http://localhost:3000";

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ user }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (!user) return;

        const socket = io(SOCKET_URL, {
            auth: { token: user.token }
        });

        // Join global/general room to hear notifications? 
        // For now, backend emits newMessage to specific room. 
        // We'll join "general" by default to demo.
        socket.emit("joinRoom", "general");

        socket.on("newMessage", (message: any) => {
            if (message.sender !== user.username) {
                setUnreadCount((prev) => prev + 1);
                setAnimate(true);
                setTimeout(() => setAnimate(false), 1000);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    return (
        <div
            className={`notification-container ${animate ? 'shake' : ''}`}
            onClick={() => setUnreadCount(0)}
            title="Click to clear notifications"
        >
            <div className="icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </div>
        </div>
    );
};

export default NotificationBadge;
