import express from "express";
import pkg from "agora-access-token";

const router = express.Router();
const { RtcTokenBuilder, RtcRole } = pkg;

router.post("/token", (req, res) => {
  try {
    const APP_ID ='ab994c07eee7434887a63166f8afcf40';
    const APP_CERTIFICATE ='316500e2c6dc400c9472e2e2831d95df';

    console.log("===== AGORA DEBUG =====");
    console.log("APP_ID:", APP_ID);
    console.log("APP_CERT:", APP_CERTIFICATE);

    if (!APP_ID || !APP_CERTIFICATE) {
      return res.status(500).json({
        error: "Agora ENV missing (check Render variables)",
      });
    }

    const { channelName, uid } = req.body;

    if (!channelName) {
      return res.status(400).json({
        error: "channelName required",
      });
    }

    const safeUid =
      uid && uid !== "null"
        ? Number(uid)
        : Math.floor(Math.random() * 100000);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      safeUid,
      RtcRole.PUBLISHER,
      expirationTime
    );

    return res.json({ token, uid: safeUid });

  } catch (err) {
    console.error("❌ AGORA ERROR:", err);
    return res.status(500).json({ error: "Token generation failed" });
  }
});

export default router;