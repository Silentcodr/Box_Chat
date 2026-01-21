
import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id: number, username: string) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user.id, user.username),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user.id, user.username),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ["password"] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.username = req.body.username || user.username;
            user.bio = req.body.bio || user.bio;
            user.avatar = req.body.avatar || user.avatar;
            // Optionally update email/password if needed

            const updatedUser = await user.save();
            res.json({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio,
                token: generateToken(updatedUser.id, updatedUser.username),
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}
