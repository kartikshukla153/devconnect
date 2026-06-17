import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
  getUnreadCount,
} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send/:userId", authMiddleware, sendMessage);

router.get(
  "/unread/count",
  authMiddleware,
  getUnreadCount
);

router.put(
  "/read/:userId",
  authMiddleware,
  markMessagesAsRead
);

router.get("/:userId", authMiddleware, getMessages);

router.get("/", authMiddleware, getConversations);

export default router;