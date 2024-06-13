"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("@controllers/users/auth.controller")); // Use the path alias
const router = (0, express_1.Router)();
const authController = new auth_controller_1.default();
// Uncomment and use the following routes as needed
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
// router.get("/user", authMiddleware, getProfile);
// router.patch("/user", authMiddleware, updateProfile);
// router.delete("/user", authMiddleware, deleteAccount);
exports.default = router;
