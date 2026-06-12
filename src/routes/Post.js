import express from "express";
import {
  createPost,
  getPosts,
  likePost,
  unlikePost,
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);

router.put("/like/:id", authMiddleware, likePost);
router.put("/unlike/:id", authMiddleware, unlikePost);

export default router;