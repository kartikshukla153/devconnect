import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/Post.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import connectionRoutes from "./src/routes/connectionRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

import { initializeSocket } from "./src/socket/socket.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("DevConnect API running...");
});

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    initializeSocket(server);

    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));