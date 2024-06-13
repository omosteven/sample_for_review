"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../app/helpers"));
const helpers = new helpers_1.default();
const socketAuthMiddleware = (socket, next) => {
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
exports.default = socketAuthMiddleware;
