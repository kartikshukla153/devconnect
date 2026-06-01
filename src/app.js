
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import profileRoutes from "./routes/profileRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("DevConnect API running...");
});

export default app;