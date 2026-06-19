import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("registerUser", (userId) => {
      onlineUsers.set(userId, socket.id);

      console.log(
        `User Registered: ${userId} -> ${socket.id}`
      );
    });

    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId =
        onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          senderId,
        });
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiverSocketId =
        onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStoppedTyping", {
          senderId,
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

export const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId);
};