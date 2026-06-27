import { Server } from "socket.io";

let io;

// Maps:
// userId -> socketId
const userSocketMap = {};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // ==========================
    // USER SOCKET MAPPING
    // ==========================
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;

      console.log(
        `User ${userId} mapped to socket ${socket.id}`
      );
    }

    // ==========================
    // PROJECT ROOMS
    // ==========================
    socket.on("join_project", (projectId) => {
      socket.join(projectId);

      console.log(
        `${socket.id} joined project ${projectId}`
      );
    });

    socket.on("leave_project", (projectId) => {
      socket.leave(projectId);

      console.log(
        `${socket.id} left project ${projectId}`
      );
    });

    // ==========================
    // DISCONNECT
    // ==========================
    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
      }

      console.log("User Disconnected:", socket.id);
    });
  });
};

// ==========================
// GET SOCKET.IO INSTANCE
// ==========================
export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io has not been initialized."
    );
  }

  return io;
};

// ==========================
// GET USER SOCKET ID
// ==========================
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export { io };