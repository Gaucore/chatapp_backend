import express from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const router = express.Router();

const APP_ID = "ab994c07eee7434887a63166f8afcf40";
const APP_CERTIFICATE = "316500e2c6dc400c9472e2e2831d95df";

router.post("/token", (req, res) => {
  const { channelName, uid } = req.body;

  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({ token });
});

export default router;