import React, { Suspense, useState } from "react";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles.css";

// Lazy load Micro-Frontends
const ChatApp = React.lazy<React.FC<any>>(() => import("chat/ChatApp"));
const PresenceWidget = React.lazy<React.FC<any>>(() => import("presence/PresenceWidget"));
const NotificationBadge = React.lazy<React.FC<any>>(() => import("notification/NotificationBadge"));

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<"chat" | "users">("chat");
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo-area">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                        </svg>
                    </div>
                    <span className="app-name">Box Chat</span>
                </div>

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        <span className="nav-icon">💬</span>
                        Chats
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span className="nav-icon">👥</span>
                        Users
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout" onClick={logout}>
                        <span className="nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <h1 className="page-title">
                        {activeTab === 'chat' ? 'Team Chat' : 'Online Users'}
                    </h1>
                    <div className="header-actions">
                        <Suspense fallback={<div>...</div>}>
                            <NotificationBadge user={user} />
                        </Suspense>
                        <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
                            <div className="status-dot online"></div>
                            {user?.avatar ? (
                                <img src={user.avatar} alt="avatar" className="avatar-img" />
                            ) : (
                                <div className="avatar">{user?.username?.substring(0, 2).toUpperCase()}</div>
                            )}
                            {showProfile && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-item">{user?.username}</div>
                                    <div className="dropdown-item">{user?.email}</div>
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-item" onClick={logout}>Logout</div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <React.Suspense fallback={<div className="loading">Loading Module...</div>}>
                        <div className="mfe-wrapper">
                            {activeTab === 'chat' && (
                                <div style={{ height: '100%', display: 'flex', width: '100%' }}>
                                    {/* Pass user and token to Chat App */}
                                    <ChatApp user={user} token={user?.token} />
                                    <PresenceWidget />
                                </div>
                            )}
                            {activeTab === "users" && <PresenceWidget fullPage />}
                        </div>
                    </React.Suspense>
                </div>
            </main>
        </div>
    );
};

const AppContent = () => {
    const { user } = useAuth();
    return user ? <Dashboard /> : <Login />;
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;

