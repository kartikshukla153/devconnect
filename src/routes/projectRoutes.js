import express from "express";

import {
  createProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  requestToJoinProject,
  approveJoinRequest,
  rejectJoinRequest,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CREATE PROJECT
 */
router.post("/", authMiddleware, createProject);

/**
 * GET ALL PROJECTS
 */
router.get("/", getAllProjects);

/**
 * GET SINGLE PROJECT
 */
router.get("/:id", getSingleProject);

/**
 * REQUEST TO JOIN PROJECT
 */
router.put(
  "/join-request/:id",
  authMiddleware,
  requestToJoinProject
);

/**
 * APPROVE JOIN REQUEST
 */
router.put(
  "/approve-request/:projectId/:userId",
  authMiddleware,
  approveJoinRequest
);

/**
 * REJECT JOIN REQUEST
 */
router.put(
  "/reject-request/:projectId/:userId",
  authMiddleware,
  rejectJoinRequest
);

/**
 * DELETE PROJECT
 */
router.delete("/:id", authMiddleware, deleteProject);

export default router;