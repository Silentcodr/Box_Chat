
import { Request, Response } from "express";
import Room from "../models/Room";
import Message from "../models/Message";
import User from "../models/User"; // Import for include

// Create Room
export const createRoom = async (req: any, res: Response) => {
    const { name, password, protected: isProtected } = req.body;
    try {
        const roomExists = await Room.findOne({ where: { name } });
        if (roomExists) {
            return res.status(400).json({ message: "Room already exists" });
        }

        const room = await Room.create({
            name,
            password,
            protected: isProtected,
            creator: req.user.username // Storing username as creator string
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get All Rooms
export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.findAll({
            attributes: { exclude: ["password"] }
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Join Room (validate password)
export const joinRoom = async (req: Request, res: Response) => {
    const { roomId, password } = req.body;
    try {
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.protected && room.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({ message: "Joined successfully", room });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get Messages for a Room
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.findAll({
            where: { roomId },
            // include: [{ model: User, as: 'senderInfo', attributes: ['username', 'avatar'] }] // Need associations setup for this
        });
        // Since we didn't setup associations yet, just returning messages. 
        // Logic might need to be enhanced later.
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
