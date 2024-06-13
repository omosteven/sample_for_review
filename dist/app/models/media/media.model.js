"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../../enums");
const { ObjectId, String } = mongoose_1.Schema.Types;
const { USERS, MEDIA } = enums_1.MODEL_NAMES;
const mediaSchema = new mongoose_1.Schema({
    fileName: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: ObjectId,
        ref: USERS,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileSize: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        enum: enums_1.MEDIA_TYPE_NAMES,
        required: true,
    },
}, {
    timestamps: true,
});
const mediaModel = (0, mongoose_1.model)(MEDIA, mediaSchema);
exports.default = mediaModel;
