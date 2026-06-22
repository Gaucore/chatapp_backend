import express from "express";
import pkg from "agora-access-token";

const router = express.Router();
const { RtcTokenBuilder, RtcRole } = pkg;

// ✅ ENV SAFE FALLBACK (so Render crash never happens)
const APP_ID =
  process.env.AGORA_APP_ID || "ab994c07eee7434887a63166f8afcf40";

const APP_CERTIFICATE =
  process.env.AGORA_APP_CERTIFICATE || "316500e2c6dc400c9472e2e2831d95df";

router.post("/token", (req, res) => {
  try {
    const { channelName, uid } = req.body;

    if (!channelName) {
      return res.status(400).json({ error: "channelName required" });
    }

    // ✅ FIX: uid null crash protection
    const safeUid = uid && uid !== "null" ? Number(uid) : Math.floor(Math.random() * 100000);

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

    return res.json({ token });
  } catch (err) {
    console.error("AGORA TOKEN ERROR:", err);
    return res.status(500).json({ error: "Token generation failed" });
  }
});

export default router;