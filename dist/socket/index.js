"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.initializeSocketServer = void 0;
const socket_io_1 = require("socket.io");
const socketAuth_middleware_1 = __importDefault(require("./middlewares/socketAuth.middleware"));
let io;
const initializeSocketServer = (server) => {
    exports.io = io = new socket_io_1.Server(server);
    io.use(socketAuth_middleware_1.default);
    io.on("connection", (socket) => {
        console.log("Socket.io client connected");
    });
};
exports.initializeSocketServer = initializeSocketServer;
