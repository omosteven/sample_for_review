"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../../enums");
const posts_model_hook_1 = __importDefault(require("../../hooks/posts.model.hook"));
const { ObjectId, String } = mongoose_1.Schema.Types;
const { USERS, POSTS } = enums_1.MODEL_NAMES;
const postsSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    madeBy: {
        // --- reference to the UserId ---
        type: ObjectId,
        ref: USERS,
        required: true,
    },
    mediaUrl: {
        type: String,
    },
    mediaType: {
        type: String,
        enum: enums_1.MEDIA_TYPE_NAMES,
    },
    canBeLiked: {
        type: Boolean,
        default: true,
    },
    allowsComments: {
        type: Boolean,
        default: true,
    },
    tags: [String],
    likes: [
        {
            type: ObjectId,
            ref: USERS,
        },
    ],
    // comments: [
    //   {
    //     type: ObjectId,
    //     ref: COMMENTS,
    //   },
    // ],
    noOfLikes: {
        type: Number,
        default: 0,
    },
    noOfComments: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
(0, posts_model_hook_1.default)(postsSchema);
const PostsModel = (0, mongoose_1.model)(POSTS, postsSchema);
exports.default = PostsModel;
