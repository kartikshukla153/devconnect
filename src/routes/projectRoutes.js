import express from "express";
import {
  createProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
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
 * DELETE PROJECT
 */
router.delete("/:id", authMiddleware, deleteProject);

export default router;