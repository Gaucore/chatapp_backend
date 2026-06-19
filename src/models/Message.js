import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "location", "contact", "call"],
      default: "text",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    // 🔥 NEW: per-user delete system
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);