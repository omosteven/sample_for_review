"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const port = 8000;
dotenv_1.default.config();
(0, database_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to Voltrox Nject Backend App!");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
