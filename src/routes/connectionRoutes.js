import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  sendConnectionRequest,
  acceptConnectionRequest,
  getPendingRequests,
  rejectConnectionRequest,
  getMyConnections,
  removeConnection,
} from "../controllers/connectionController.js";

const router = express.Router();

router.post(
  "/request/:userId",
  authMiddleware,
  sendConnectionRequest
);

router.post(
  "/accept/:userId",
  authMiddleware,
  acceptConnectionRequest
);

router.post(
  "/reject/:userId",
  authMiddleware,
  rejectConnectionRequest
);

router.get(
  "/pending",
  authMiddleware,
  getPendingRequests
);

router.get(
  "/my-connections",
  authMiddleware,
  getMyConnections
);

router.delete(
  "/remove/:userId",
  authMiddleware,
  removeConnection
);

export default router;