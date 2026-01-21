
import React, { useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isRegister) {
                const { data } = await API.post("/auth/register", { username, email, password });
                login(data);
            } else {
                const { data } = await API.post("/auth/login", { email, password });
                login(data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (

        <div className="login-container">
            <div className="login-box">
                <div>
                    <h2>{isRegister ? "Create an account" : "Welcome back!"}</h2>
                    <p className="login-subtitle">
                        {isRegister ? "Get started with Box Chat today." : "We're so excited to see you again!"}
                    </p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">
                        {isRegister ? "Continue" : "Log In"}
                    </button>
                </form>
                <p className="switch-auth">
                    {isRegister ? "Already have an account?" : "Need an account?"}
                    <span onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Log In" : "Register"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
