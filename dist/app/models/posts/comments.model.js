"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("app/enums");
const { ObjectId, String } = mongoose_1.Schema.Types;
const { COMMENTS, USERS, POSTS } = enums_1.MODEL_NAMES;
const commentsSchema = new mongoose_1.Schema({
    postId: {
        type: ObjectId,
        ref: POSTS,
        required: true,
    },
    userId: {
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
const CommentsModel = (0, mongoose_1.model)(COMMENTS, commentsSchema);
exports.default = CommentsModel;
