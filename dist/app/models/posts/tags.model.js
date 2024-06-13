"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("app/enums");
const { String, ObjectId } = mongoose_1.Schema.Types;
const { TAGS, POSTS } = enums_1.MODEL_NAMES;
const tagsSchema = new mongoose_1.Schema({
    tagName: {
        type: String,
        required: true,
    },
    posts: [
        {
            type: ObjectId,
            ref: POSTS,
        },
    ],
}, {
    timestamps: true,
});
const TagsModel = (0, mongoose_1.model)(TAGS, tagsSchema);
exports.default = TagsModel;
