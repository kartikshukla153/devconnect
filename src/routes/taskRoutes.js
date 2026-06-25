import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTask,
  getProjectTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

/**
 * CREATE TASK
 */
router.post(
  "/",
  authMiddleware,
  createTask
);

/**
 * GET PROJECT TASKS
 */
router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectTasks
);

export default router;