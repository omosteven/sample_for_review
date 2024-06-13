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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("../../config/config"));
class Helpers {
    // Method to generate a JWT token for a given email
    generateToken(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtKey = (0, config_1.default)("jwt_key");
            const jwtExpirySeconds = 604800; // Token expiration time set to one week (in seconds)
            const token = jsonwebtoken_1.default.sign({ email, userId }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            });
            return token;
        });
    }
    // Method to hash a given password
    hashPassword(password) {
        const saltRounds = 10;
        const hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
        return hashedPassword;
    }
    // Method to compare two passwords
    comparePasswords(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = yield bcrypt_1.default.compare(password, hashedPassword);
            return match;
        });
    }
    validatePayloads(payloads, validators) {
        var _a;
        let isValid = true;
        for (let v = 0; v < (validators === null || validators === void 0 ? void 0 : validators.length); v++) {
            isValid = Boolean(payloads === null || payloads === void 0 ? void 0 : payloads[validators[v]]);
            if (!isValid) {
                return {
                    isValid: false,
                    errorMessage: `${validators[v]} is missing`,
                };
            }
        }
        if (validators.includes("email")) {
            isValid = /.+\@.+\..+/.test(payloads["email"]);
            if (!isValid) {
                return {
                    isValid: false,
                    errorMessage: "Email is invalid",
                };
            }
        }
        if (validators.includes("password")) {
            isValid = ((_a = payloads["password"]) === null || _a === void 0 ? void 0 : _a.length) >= 8;
            if (!isValid) {
                return {
                    isValid: false,
                    errorMessage: "Password must be at least 8 characters long",
                };
            }
        }
        return {
            isValid,
        };
    }
    areHashtagsValid(hashTags) {
        if (!Array.isArray(hashTags)) {
            return false; // Ensure the input is an array
        }
        return hashTags.every((hashTag) => typeof hashTag === "string" && hashTag.startsWith("#"));
    }
    pagination(req, keyword) {
        let { pageSize = 10, currentPage = 1, search = "" } = req.query;
        pageSize = parseInt(pageSize, 10);
        currentPage = parseInt(currentPage, 10);
        const searchQuery = search.trim();
        // Create a search filter
        const filter = searchQuery
            ? { [keyword]: { $regex: searchQuery, $options: "i" } }
            : {};
        return { pageSize, currentPage, filter };
    }
    isObjectIdValid(id) {
        return mongodb_1.ObjectId.isValid(id) && new mongodb_1.ObjectId(id).toString() === id;
    }
    isStringEmpty(content, minLength = 0) {
        if (typeof content === "string" && content.trim().length > minLength) {
            return false;
        }
        else {
            return true;
        }
    }
    validateToken(token) {
        return jsonwebtoken_1.default.verify(token, (0, config_1.default)("jwt_key"));
    }
}
exports.default = Helpers;
