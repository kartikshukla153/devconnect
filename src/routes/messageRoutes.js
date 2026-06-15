import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send/:userId", authMiddleware, sendMessage);

router.get("/:userId", authMiddleware, getMessages);

router.get("/", authMiddleware, getConversations);

export default router;