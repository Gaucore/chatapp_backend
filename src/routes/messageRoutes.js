import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/messageController.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  sendMessage
);

router.get(
  "/:chatId",
  protect,
  getMessages
);


router.delete("/:messageId", protect, deleteMessage);


export default router;