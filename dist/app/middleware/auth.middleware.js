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
const users_model_1 = __importDefault(require("../models/users/users.model"));
const helpers_1 = __importDefault(require("../helpers"));
const helpers = new helpers_1.default();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                code: 401,
                message: "Authorization header missing",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: "Token missing",
            });
        }
        const decodedToken = helpers.validateToken(token);
        /*  ---
            this operation below will run at a constant time O(1),
            thus it will not have much effect on the time complexity of this middleware
            ---
        **/
        const fetchedUser = yield users_model_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId).select("token password");
        if ((fetchedUser === null || fetchedUser === void 0 ? void 0 : fetchedUser.token) !== token) {
            return res.status(401).json({
                code: 401,
                message: "Unauthorized: invalid Token",
            });
        }
        // --- only run if the user is on this route ---
        if (req.route.path === "/auth/change-password") {
            const { oldPassword, newPassword } = req.body || {};
            if (helpers.isStringEmpty(oldPassword, 7) ||
                helpers.isStringEmpty(newPassword, 7)) {
                return res.status(401).json({
                    code: 401,
                    message: "One or both passwords are missing or not up to 8 characters",
                });
            }
            // --- compare the found user's password with the inputed password ---
            const doPasswordsMatch = yield helpers.comparePasswords(oldPassword, fetchedUser.password);
            if (!doPasswordsMatch) {
                return res.status(401).json({
                    code: 401,
                    message: "Incorrect old password",
                });
            }
            const hashedPassword = helpers.hashPassword(newPassword);
            fetchedUser.password = hashedPassword;
            fetchedUser.save();
            return res.status(201).json({
                code: 201,
                message: "Password updated successfully",
            });
        }
        req.body.user = decodedToken;
        next();
    }
    catch (error) {
        return res.status(401).json({
            code: 401,
            message: "Unauthorized",
        });
    }
});
exports.default = auth;
