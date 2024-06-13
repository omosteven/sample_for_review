"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_route_1 = __importDefault(require("./posts.route"));
const users_route_1 = __importDefault(require("./users.route"));
const comments_route_1 = __importDefault(require("./comments.route"));
const media_route_1 = __importDefault(require("./media.route"));
const router = (0, express_1.Router)();
const rootRouter = () => {
    router.use((0, users_route_1.default)());
    router.use((0, posts_route_1.default)());
    router.use((0, comments_route_1.default)());
    router.use((0, media_route_1.default)());
    return router;
};
exports.default = rootRouter;
