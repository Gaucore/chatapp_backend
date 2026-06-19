

import express from "express";
import protect from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";
import {
  createChat,
  getChats,
} from "../controllers/chatController.js";

const router = express.Router();

// CREATE CHAT
router.post("/", protect, createChat);

// GET CHATS
router.get("/", protect, getChats);

// ✅ FIXED TEST ROUTE (REAL WORKING)
router.get("/create-test-chat", protect, async (req, res) => {
  try {
    const chat = await Chat.create({
      participants: [
        req.user._id,
        req.user._id // self chat for testing
      ],
    });

    res.json({
      success: true,
      chat,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;