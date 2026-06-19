import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

import {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
} from "../controllers/userController.js";

const router = express.Router();

/* ================= USERS ================= */
router.get("/", protect, getUsers);

/* ================= PROFILE ================= */
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

/* ================= PASSWORD ================= */
router.put("/change-password", protect, changePassword);

/* ================= AVATAR UPLOAD (FIXED) ================= */
router.put(
  "/profile/avatar",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        "avatars"
      );

      const user = await User.findById(req.user._id);

      user.avatar = result.secure_url;
      await user.save();

      res.json({
        success: true,
        avatar: user.avatar,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

export default router;