"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMulterFile = exports.uploadToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../../../config/cloudinary"));
const storage = multer_1.default.memoryStorage();
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
            .end(file.buffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
exports.uploadMulterFile = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limiting file size to 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image") ||
            file.mimetype.startsWith("video") ||
            file.mimetype === "application/pdf") {
            cb(null, true); // Accept the file
        }
        else {
            cb(new Error("Invalid file type")); // Reject the file with an error
        }
    },
}).single("file");
