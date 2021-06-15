import { Server } from "socket.io";
import { getCustomError } from "./helper/error.js";

let io;

export const setIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // *
      methods: ["GET", "POST"],
    },
  });
};

export const getIO = () => {
  if (!io) {
    throw getCustomError("Socket.io not initialized", 500, null);
  }

  return io;
};
