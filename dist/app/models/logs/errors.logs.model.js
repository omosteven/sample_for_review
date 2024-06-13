"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../../enums");
const { String, ObjectId } = mongoose_1.Schema.Types;
const { USERS, ERROR_LOGS } = enums_1.MODEL_NAMES;
const errorLogSchema = new mongoose_1.Schema({
    errorMessage: {
        type: String,
        required: true,
    },
    errorStack: {
        type: String,
    },
    collectionName: {
        type: String,
        required: false,
    },
    userId: {
        type: ObjectId,
        ref: USERS,
        required: false,
    },
}, {
    timestamps: true,
});
const ErrorLogModel = (0, mongoose_1.model)(ERROR_LOGS, errorLogSchema);
exports.default = ErrorLogModel;
