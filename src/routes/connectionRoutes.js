import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  sendConnectionRequest,
  acceptConnectionRequest,
  getPendingRequests,
  rejectConnectionRequest,
  getMyConnections,
  removeConnection,
  cancelConnectionRequest,
} from "../controllers/connectionController.js";

const router = express.Router();

/**
 * SEND REQUEST
 */
router.post(
  "/request/:userId",
  authMiddleware,
  sendConnectionRequest
);

/**
 * ACCEPT REQUEST
 */
router.post(
  "/accept/:userId",
  authMiddleware,
  acceptConnectionRequest
);

/**
 * REJECT REQUEST
 */
router.post(
  "/reject/:userId",
  authMiddleware,
  rejectConnectionRequest
);

/**
 * CANCEL SENT REQUEST
 */
router.delete(
  "/cancel/:userId",
  authMiddleware,
  cancelConnectionRequest
);

/**
 * GET PENDING REQUESTS
 */
router.get(
  "/pending",
  authMiddleware,
  getPendingRequests
);

/**
 * GET MY CONNECTIONS
 */
router.get(
  "/my-connections",
  authMiddleware,
  getMyConnections
);

/**
 * REMOVE CONNECTION
 */
router.delete(
  "/remove/:userId",
  authMiddleware,
  removeConnection
);

export default router;