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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../../models/users/users.model"));
const helpers_1 = __importDefault(require("../../helpers"));
const resp_handlers_1 = __importDefault(require("../../utils/resp-handlers"));
const enums_1 = require("../../enums");
const { USERS } = enums_1.MODEL_NAMES;
const helpers = new helpers_1.default();
const responseHandlers = new resp_handlers_1.default();
class AuthController {
    // -- login -- function
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // --- wrap the DB queries inside try and catch to catch  errors  ---
            try {
                // --- check if the payloads pass the neccessary validations ---
                const { isValid, errorMessage } = helpers.validatePayloads(req.body, [
                    "email",
                    "password",
                ]);
                if (!isValid) {
                    return responseHandlers.error(res, errorMessage);
                }
                // --- retrive the user details by the email ---
                const user = yield users_model_1.default.findOne({ email });
                // --- check if a user  is found or not
                if (!user) {
                    return responseHandlers.error(res, "Email or password invalid");
                }
                // --- compare the found user's password with the inputed password ---
                const doPasswordsMatch = yield helpers.comparePasswords(password, user.password);
                if (!doPasswordsMatch) {
                    return responseHandlers.error(res, "Email or password invalid");
                }
                // --- generate a user auth token for  the user ---
                const newToken = yield helpers.generateToken(email, user === null || user === void 0 ? void 0 : user._id);
                // --- update the user auth token of the user in their respective record ---
                yield users_model_1.default.updateOne({ email }, { token: newToken });
                // -- destructure and exclude the password from the object --
                const _a = user.toObject(), { password: _ } = _a, updatedUser = __rest(_a, ["password"]);
                updatedUser.token = newToken;
                // --- respond back ---
                return responseHandlers.success(res, updatedUser, "Login successful");
            }
            catch (error) {
                return yield responseHandlers.mongoError(req, res, error, USERS);
            }
        });
    }
    // --- register user  function ---
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, lastName } = req.body;
            try {
                // --- check if  the payloads pass the neccessary validations ---
                const { isValid, errorMessage } = helpers.validatePayloads(req.body, [
                    "email",
                    "password",
                    "firstName",
                    "lastName",
                ]);
                if (!isValid) {
                    return responseHandlers.error(res, errorMessage);
                }
                // --- hash the password before saving the new user record ---
                // --- the purpose of hashing is to protect the password. Hashed data cannot be reversed ---
                const hashedPassword = helpers.hashPassword(password);
                // --- initiate the Users Model ---
                const newUser = new users_model_1.default({
                    email,
                    firstName,
                    lastName,
                    password: hashedPassword,
                });
                //   --- save the user record if payload/field requirements are passed ---
                yield newUser.save();
                return responseHandlers.success(res, { email, firstName, lastName }, "Account created successfully", 201);
            }
            catch (error) {
                // --- handle errors here including duplicate email for registration of any taken email ---
                return yield responseHandlers.mongoError(req, res, error, USERS);
            }
        });
    }
    // --- this will be nice features to have ---
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = AuthController;
