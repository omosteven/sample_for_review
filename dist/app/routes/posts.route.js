"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
const postsController = new controllers_1.PostsController();
const postsRoute = () => {
    router.post("/posts/create", auth_middleware_1.default, postsController.createPost);
    router.get("/posts/mine", auth_middleware_1.default, postsController.fetchMyPosts);
    router.get("/posts", auth_middleware_1.default, postsController.fetchAllPosts);
    router.get("/posts/:postId", auth_middleware_1.default, postsController.fetchPostById);
    router.patch("/posts/:postId", auth_middleware_1.default, postsController.editPost);
    router.delete("/posts/:postId", auth_middleware_1.default, postsController.deletePost);
    router.put("/posts/like/:postId", auth_middleware_1.default, postsController.likeAPost);
    router.get("/posts/tags", auth_middleware_1.default, postsController.searchPostsByTag);
    return router;
};
exports.default = postsRoute;
