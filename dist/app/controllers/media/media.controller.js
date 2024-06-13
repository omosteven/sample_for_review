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
const resp_handlers_1 = __importDefault(require("../../utils/resp-handlers"));
const media_model_1 = __importDefault(require("../../models/media/media.model"));
const responseHandlers = new resp_handlers_1.default();
class MediaController {
    uploadMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            const { fileName, fileType, fileSize, fileUrl } = req.body.uploadedFileInfo;
            try {
                // --- the main purpose of storing this to  the DB is to keep track of uploaded files ---
                const saveMedia = new media_model_1.default({
                    fileName,
                    fileType,
                    fileSize,
                    fileUrl,
                    uploadedBy: userId,
                });
                yield saveMedia.save();
                return responseHandlers.success(res, {
                    fileName,
                    fileType,
                    fileSize,
                    fileUrl,
                    _id: saveMedia._id,
                });
            }
            catch (error) {
                return responseHandlers.error(res, "An error occurred");
            }
        });
    }
}
exports.default = MediaController;
