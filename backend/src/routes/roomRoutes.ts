
import express from "express";
import { createRoom, getRooms, joinRoom, getMessages } from "../controllers/roomController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", protect, getRooms);
router.post("/join", protect, joinRoom);
router.get("/:roomId/messages", protect, getMessages);

export default router;
