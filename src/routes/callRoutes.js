import express from "express";
import {
  createCallLog,
  updateCallStatus,
} from "../controllers/callController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createCallLog);
router.put("/update", authMiddleware, updateCallStatus);

export default router;