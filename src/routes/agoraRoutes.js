import express from "express";
import pkg from "agora-access-token";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const { RtcTokenBuilder, RtcRole } = pkg;

// 🔥 NOW FROM ENV (SAFE)
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

router.post("/token", (req, res) => {
  try {
    const { channelName, uid } = req.body;

    if (!channelName || !uid) {
      return res.status(400).json({
        error: "channelName and uid are required",
      });
    }

    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs =
      currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return res.json({ token });
  } catch (error) {
    console.error("Agora Token Error:", error);
    return res.status(500).json({
      error: "Failed to generate Agora token",
    });
  }
});

export default router;