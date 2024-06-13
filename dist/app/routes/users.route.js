"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
const authController = new controllers_1.AuthController();
const profileController = new controllers_1.ProfileController();
const usersRoute = () => {
    router.post("/auth/login", authController.login);
    router.post("/auth/register", authController.register);
    router.put("/auth/change-password", auth_middleware_1.default);
    router.get("/user/me", auth_middleware_1.default, profileController.getProfile);
    router.patch("/user/me", auth_middleware_1.default, profileController.updateProfile);
    router.delete("/user/me", auth_middleware_1.default, profileController.deleteAccount);
    router.patch("/user/me/deactivate", auth_middleware_1.default, profileController.deactivateAccount);
    router.delete("/user/me/picture", auth_middleware_1.default, profileController.deletePicture);
    return router;
};
exports.default = usersRoute;
