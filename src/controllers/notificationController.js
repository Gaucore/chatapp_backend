import Notification from "../models/Notification.js";

/**
 * CREATE NOTIFICATION (ONLY TARGET USER)
 */
export const createNotification = async (
  userId,
  title,
  message,
  type = "message",
  data = {},
  sender = null
) => {
  const notification = await Notification.create({
    user: userId,
    sender,
    title,
    message,
    type,
    data,
  });

  const fullNotification = await Notification.findById(notification._id)
    .populate("sender", "name avatar");

  // ✅ FIX: ONLY SEND TO THAT USER (NOT ALL USERS)
  const socketId = global.onlineUsers?.get(userId.toString());

  if (socketId) {
    global.io.to(socketId).emit("notification", fullNotification);
  }

  return fullNotification;
};

/**
 * GET NOTIFICATIONS (ONLY LOGGED-IN USER)
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * MARK AS READ
 */
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * ⭐ READ ALL NOTIFICATIONS (IMPORTANT FIX)
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      unreadCount: 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.json({
      success: true,
      message: "Notifications cleared",
      unreadCount: 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};