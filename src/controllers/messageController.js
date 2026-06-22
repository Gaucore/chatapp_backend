import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { createNotification } from "./notificationController.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type, url } = req.body;

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content: content || "",
      type: type || "text",
      url: url || null,
      deletedFor: [], // 🔥 ensure empty
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    const senderUser = await User.findById(req.user._id).select("name avatar");

    const chat = await Chat.findById(chatId).populate("participants", "_id");

    const receiver = chat.participants.find(
      (p) => p._id.toString() !== req.user._id.toString()
    );

    if (receiver) {
      await createNotification(
        receiver._id,
        "New Message",
        `${senderUser.name} sent you a message`,
        "message",
        {
          chatId,
          sender: {
            _id: senderUser._id,
            name: senderUser.name,
            avatar: senderUser.avatar,
          },
        }
      );
    }

    global.io.to(chatId).emit("receive-message", message);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
      deletedFor: { $ne: req.user._id }, // 🔥 KEY FIX
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // 🔥 Add user in deletedFor array
    if (!message.deletedFor.includes(req.user._id)) {
      message.deletedFor.push(req.user._id);
    }

    await message.save();

    // update last message safely
    const lastMsg = await Message.findOne({ chat: message.chat })
      .sort({ createdAt: -1 });

    await Chat.findByIdAndUpdate(message.chat, {
      lastMessage: lastMsg ? lastMsg._id : null,
    });

      const socketId =global.onlineUsers.get(req.user._id.toString());

      if (socketId) {
        global.io.to(socketId).emit("message-deleted", {
          messageId,
        });
      }

    res.json({
      success: true,
      message: "Message deleted for user only",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};