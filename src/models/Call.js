import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },
    status: {
      type: String,
      enum: ["missed", "accepted", "rejected", "ended"],
      default: "missed",
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Call", callSchema);