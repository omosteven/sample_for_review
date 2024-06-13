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
const config_1 = __importDefault(require("../../config/config"));
class Helpers {
    // Method to generate a JWT token for a given email
    generateToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtKey = (0, config_1.default)("jwt_key");
            const jwtExpirySeconds = 604800; // Token expiration time set to one week (in seconds)
            const token = jsonwebtoken_1.default.sign({ email }, jwtKey, {
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
    validatePayload(payloads) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = Helpers;
