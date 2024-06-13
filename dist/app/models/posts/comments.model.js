"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../../enums");
const comments_model_hook_1 = __importDefault(require("../../hooks/comments.model.hook"));
const { ObjectId, String } = mongoose_1.Schema.Types;
const { COMMENTS, USERS, POSTS } = enums_1.MODEL_NAMES;
const commentsSchema = new mongoose_1.Schema({
    post: {
        type: ObjectId,
        ref: POSTS,
        required: true,
    },
    user: {
        type: ObjectId,
        ref: USERS,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
(0, comments_model_hook_1.default)(commentsSchema);
const CommentsModel = (0, mongoose_1.model)(COMMENTS, commentsSchema);
exports.default = CommentsModel;
