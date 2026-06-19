import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  searchUsers,
  getContacts,
  addContact,
  removeContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.get(
  "/search",
  protect,
  searchUsers
);

router.get(
  "/",
  protect,
  getContacts
);

router.post(
  "/add",
  protect,
  addContact
);

router.delete(
  "/remove",
  protect,
  removeContact
);

export default router;