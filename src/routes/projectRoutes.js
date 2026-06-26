import express from "express";

import {
  createProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  requestToJoinProject,
  approveJoinRequest,
  rejectJoinRequest,
  inviteDeveloperToProject,
  acceptProjectInvite,
  rejectProjectInvite,
  getProjectDashboard,
  getProjectActivity,
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
 * PROJECT DASHBOARD
 */
router.get(
  "/dashboard/:projectId",
  authMiddleware,
  getProjectDashboard
);
router.get(
  "/activity/:projectId",
  authMiddleware,
  getProjectActivity
);
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
 * INVITE DEVELOPER
 */
router.put(
  "/invite/:projectId/:userId",
  authMiddleware,
  inviteDeveloperToProject
);

/**
 * ACCEPT PROJECT INVITE
 */
router.put(
  "/accept-invite/:projectId",
  authMiddleware,
  acceptProjectInvite
);

/**
 * REJECT PROJECT INVITE
 */
router.put(
  "/reject-invite/:projectId",
  authMiddleware,
  rejectProjectInvite
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
router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

export default router;