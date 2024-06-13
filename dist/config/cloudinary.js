"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const cloudinary = require("cloudinary").v2;
cloudinary.config((0, config_1.default)("cloudinary"));
exports.default = cloudinary;
