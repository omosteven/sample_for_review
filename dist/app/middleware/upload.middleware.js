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
const multer_1 = __importDefault(require("multer"));
const media_1 = require("../services/media");
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        // --- Perform the file upload using multer ---
        (0, media_1.uploadMulterFile)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                // --- Multer error handling ---
                if (err instanceof multer_1.default.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return res
                            .status(400)
                            .json({ error: "File size exceeds 10MB limit", code: 400 });
                    }
                    else {
                        return res.status(400).json({ error: err.message, code: 400 });
                    }
                }
                else {
                    return res.status(400).json({ error: "Invalid file", code: 400 });
                }
            }
            else if (!req.file) {
                // --- if multer didn't receive a file ---
                return res.status(400).json({ error: "No file uploaded", code: 400 });
            }
            else {
                // --- if multer successfully uploaded the file, continue processing ---
                const file = req.file;
                // --- Upload file to Cloudinary ---
                try {
                    const cloudinaryResult = yield (0, media_1.uploadToCloudinary)(file);
                    // --- Attach Cloudinary response to req.body.fileInfo ---
                    req.body.uploadedFileInfo = {
                        fileName: cloudinaryResult.original_filename,
                        fileType: cloudinaryResult.resource_type.toUpperCase(),
                        fileSize: cloudinaryResult.bytes,
                        fileUrl: cloudinaryResult.secure_url,
                    };
                    req.body.user = user;
                    next();
                }
                catch (cloudinaryError) {
                    return res
                        .status(500)
                        .json({ error: "Error uploading file to cloud", code: 500 });
                }
            }
        }));
    }
    catch (error) {
        return res.status(500).json({ error: "Error uploading file", code: 500 });
    }
});
exports.default = upload;
