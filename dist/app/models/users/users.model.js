"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../../enums");
const { String } = mongoose_1.Schema.Types;
const { USERS } = enums_1.MODEL_NAMES;
const usersSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        // --- throws error if the record doesn't conform with email ---
        match: /.+\@.+\..+/,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: "",
    },
    country: {
        type: String,
        default: "Nigeria",
    },
    language: {
        type: String,
        default: "English",
    },
    password: {
        type: String,
        minLength: 8,
        required: true,
    },
    isActive: {
        type: Boolean,
        // default this to true for every newly signedin user
        default: true,
    },
    token: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
const UsersModel = (0, mongoose_1.model)(USERS, usersSchema);
exports.default = UsersModel;
