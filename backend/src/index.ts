
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import Message from "./models/Message";
import User from "./models/User";

dotenv.config();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL Database connected...");
        await sequelize.sync(); // Sync models

        const app = express();
        app.use(cors());
        app.use(express.json());

        app.use("/api/auth", authRoutes);
        app.use("/api/rooms", roomRoutes);

        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Simple in-memory presence store
        interface OnlineUser {
            id: string; // Socket ID
            username: string;
            online: boolean;
        }
        const onlineUsers: Record<string, OnlineUser> = {};

        io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            // Allow user to announce presence
            socket.on("join", (username: string) => {
                onlineUsers[socket.id] = { id: socket.id, username, online: true };
                io.emit("userList", Object.values(onlineUsers));
                console.log(`${username} joined (Presence)`);
            });

            socket.on("joinRoom", (roomId) => {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
            });

            socket.on("sendMessage", async (data) => {
                try {
                    const user = await User.findOne({ where: { username: data.sender } });

                    const newMessage = await Message.create({
                        roomId: data.roomId,
                        sender: data.sender,
                        senderId: user ? user.id : null,
                        content: data.content
                    });

                    // Emit to room
                    io.to(data.roomId).emit("newMessage", {
                        id: newMessage.id,
                        roomId: newMessage.roomId,
                        sender: newMessage.sender,
                        content: newMessage.content,
                        timestamp: newMessage.createdAt
                    });
                } catch (error) {
                    console.error("Error saving message", error);
                }
            });

            socket.on("disconnect", () => {
                if (onlineUsers[socket.id]) {
                    delete onlineUsers[socket.id];
                    io.emit("userList", Object.values(onlineUsers));
                }
                console.log("User disconnected");
            });
        });

        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to connect to Database", error);
        process.exit(1);
    }
};

startServer();
