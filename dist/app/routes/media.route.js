"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
const mediaController = new controllers_1.MediaController();
const mediaRoute = () => {
    router.post("/media/upload", auth_middleware_1.default, mediaController.uploadMedia);
    return router;
};
exports.default = mediaRoute;
