import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["message", "group", "system"],
      default: "message",
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    data: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);