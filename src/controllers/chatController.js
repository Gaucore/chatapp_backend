



import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// CREATE CHAT
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId missing",
      });
    }

    let chat = await Chat.findOne({
      participants: {
        $all: [req.user._id, userId],
      },
    }).populate("participants", "name email avatar isOnline");

    if (chat) {
      return res.json({
        success: true,
        chat,
      });
    }

    chat = await Chat.create({
      participants: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(chat._id).populate(
      "participants",
      "name email avatar isOnline"
    );

    res.status(201).json({
      success: true,
      chat: fullChat,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET CHATS
export const getChats = async (req, res) => {
  try {
    console.log("🔥 USER:", req.user._id);

    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "name email avatar isOnline")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    console.log("🔥 CHATS:", chats);

    res.json({
      success: true,
      chats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};