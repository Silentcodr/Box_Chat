
import React, { useState } from "react";
import createAPI from "../api";

interface CreateRoomModalProps {
    onClose: () => void;
    onCreated: () => void;
    token: string;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onCreated, token }) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const api = createAPI(token);
            await api.post("/rooms", {
                name,
                password: isPrivate ? password : null,
                protected: isPrivate
            });
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create room");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Create New Room</h3>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Room Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        <label>Private Room (Requires Password)</label>
                    </div>
                    {isPrivate && (
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={isPrivate}
                            />
                        </div>
                    )}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;
