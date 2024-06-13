"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
const tagsController = new controllers_1.TagsController();
const commentsController = new controllers_1.CommentsController();
const commentsRoute = () => {
    router.get("/tags", auth_middleware_1.default, tagsController.fetchAllTags);
    router.post("/posts/comments/:postId", auth_middleware_1.default, commentsController.addCommentToPost);
    router.put("/posts/comments/:commentId", auth_middleware_1.default, commentsController.editCommentById);
    router.delete("/posts/comments/:commentId", auth_middleware_1.default, commentsController.deleteCommentById);
    router.get("/posts/comments/:postId", auth_middleware_1.default, commentsController.fetchAllCommentsByPostId);
    return router;
};
exports.default = commentsRoute;
