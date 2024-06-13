import { Socket } from "socket.io";

import Helpers from "../../app/helpers";

const helpers = new Helpers();

const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    socket.emit("error", "Authentication error: Token missing");
    return next();
  }

  //   --- validate token here ---
  const decodedToken = helpers.validateToken(token);

  if (!decodedToken) {
    socket.emit("error", "Authentication error: Invalid token");
    return next();
  }

  next();
};

export default socketAuthMiddleware;
