"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
// import rootRouter from "./app/routes";
const database_1 = __importDefault(require("./config/database"));
const socket_1 = require("./socket");
const routes_1 = __importDefault(require("app/routes"));
const app = (0, express_1.default)();
const port = 8000;
dotenv_1.default.config();
(0, database_1.default)();
// create http server instance
const server = http_1.default.createServer(app);
// Initialize Socket  server
(0, socket_1.initializeSocketServer)(server);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/api/v1", (0, routes_1.default)());
app.get("/", (req, res) => {
    res.send("Welcome to Voltrox Nject Backend App!");
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
