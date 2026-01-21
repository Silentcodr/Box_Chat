import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { addUser, removeUser, getAllUsers, addMessage, getMessages, getRooms } from "./store";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for demo purposes
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Box Chat Backend is running");
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins with a username
    socket.on("join", (username: string) => {
        const user = addUser(socket.id, username);
        io.emit("userList", getAllUsers()); // Broadcast new user list
        console.log(`${username} joined`);
    });

    socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);
        const messages = getMessages(roomId);
        socket.emit("messageHistory", { roomId, messages });
    });

    socket.on("sendMessage", (data: { roomId: string, content: string, sender: string }) => {
        const newMessage = {
            id: Date.now().toString(),
            roomId: data.roomId,
            sender: data.sender,
            content: data.content,
            timestamp: new Date().toISOString()
        };
        addMessage(data.roomId, newMessage);
        io.to(data.roomId).emit("newMessage", newMessage);
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.emit("userList", getAllUsers());
            console.log(`${user.username} disconnected`);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
