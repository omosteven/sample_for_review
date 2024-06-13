"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = (key) => {
    const configKeys = {
        jwt_key: process.env.JWT_SECRET_KEY || "",
        dbURL: process.env.NODE_ENV === "production"
            ? process.env.PROD_DATABASE
            : process.env.DEV_DATABASE,
    };
    return configKeys[key];
};
exports.default = config;
