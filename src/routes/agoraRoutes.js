import express from "express";
import pkg from "agora-access-token";
import dotenv from "dotenv";

dotenv.config(); // MUST

const router = express.Router();
const { RtcTokenBuilder, RtcRole } = pkg;

// SAFE FALLBACK (IMPORTANT FOR RENDER CRASH)
const APP_ID = process.env.AGORA_APP_ID || "ab994c07eee7434887a63166f8afcf40";
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || "316500e2c6dc400c9472e2e2831d95df";

router.post("/token", (req, res) => {
  try {
    const { channelName, uid } = req.body;

    console.log("AGORA REQUEST:", req.body);

    if (!channelName) {
      return res.status(400).json({ error: "channelName required" });
    }

    if (!APP_ID || !APP_CERTIFICATE) {
      return res.status(500).json({
        error: "AGORA env missing (APP_ID / CERTIFICATE)",
      });
    }

    // 🔥 FIX: UID MUST BE VALID NUMBER (Agora rule)
    const safeUid =
      uid && uid !== "null" && uid !== "undefined"
        ? Number(uid)
        : Math.floor(Math.random() * 100000);

    const role = RtcRole.PUBLISHER;

    const expirationTime = Math.floor(Date.now() / 1000) + 3600;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      safeUid,
      role,
      expirationTime
    );

    return res.json({
      token,
      uid: safeUid,
    });
  } catch (err) {
    console.error("AGORA TOKEN ERROR:", err);
    return res.status(500).json({ error: "Token generation failed" });
  }
});

export default router;