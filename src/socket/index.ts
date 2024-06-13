import http from "http";

import { Server as SocketIOServer, Socket } from "socket.io";

import socketAuthMiddleware from "./middlewares/socketAuth.middleware";

let io: SocketIOServer;

const initializeSocketServer = (server: http.Server) => {
  io = new SocketIOServer(server);

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log("Socket.io client connected");
  });
};

export { initializeSocketServer, io };
