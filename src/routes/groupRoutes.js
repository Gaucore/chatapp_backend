import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createGroup,
  getGroups,
  addMember,
  removeMember,
} from "../controllers/groupController.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  createGroup
);

router.get(
  "/",
  protect,
  getGroups
);

router.put(
  "/add-member",
  protect,
  addMember
);

router.put(
  "/remove-member",
  protect,
  removeMember
);

export default router;