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
const users_model_1 = __importDefault(require("app/models/users/users.model"));
const helpers_1 = __importDefault(require("app/helpers"));
const helpers = new helpers_1.default();
/**
  @param {Request} req
  
  @param {Response}  res

  @returns
**/
class AuthController {
    // -- login -- function
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // --- wrap the DB queries inside try and catch to catch  errors
            try {
                const user = yield users_model_1.default.findOne({ email });
                // --- check if a  user  is found or not
                if (!user) {
                    return res.status(400).json({
                        code: 400,
                        message: "Email or password invalid",
                    });
                }
                // --- compare the found user's password with the inputed password
                const doPasswordsMatch = yield helpers.comparePasswords(password, user.password);
                if (!doPasswordsMatch) {
                    return res.status(400).json({
                        code: 400,
                        message: "Email or password invalid",
                    });
                }
                // --- generate a user token for  the user ---
                const newToken = yield helpers.generateToken(email);
                // --- update the  user token of the user in their respective DB record ---
                yield users_model_1.default.updateOne({ email }, { token: newToken });
                const { firstName, lastName } = user;
                return res.status(200).json({
                    message: "User logged in",
                    data: { email, firstName, lastName, token: newToken },
                });
            }
            catch (error) {
                console.error("Login Error:", error);
                return res.status(500).json({
                    code: 500,
                    message: "An error occurred during login",
                });
            }
        });
    }
    // --- register user  function ---
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, lastName } = req.body;
            try {
                // --- check if any of the payloads is missing ---
                if (!email || !password || !firstName || !lastName) {
                    return res.status(400).json({
                        code: 400,
                        message: "Invalid payload. All fields are required.",
                    });
                }
                // ---  check if the password length requirement is meant
                if (password.length < 8) {
                    return res.status(400).json({
                        code: 400,
                        message: "Password must be at least 8 characters long",
                    });
                }
                // const existingUser = await UsersModel.findOne({ email });
                // if (existingUser) {
                //   return res.status(400).json({
                //     code: 400,
                //     message: "Email is already in use",
                //   });
                // }
                // --- hash the password before saving the new user record ---
                const hashedPassword = helpers.hashPassword(password);
                const newUser = new users_model_1.default({
                    email,
                    firstName,
                    lastName,
                    password: hashedPassword,
                });
                //   --- save the user record if they pass the field requirements ---
                yield newUser.save();
                return res.status(201).json({
                    code: 201,
                    message: "Account created successfully",
                    data: { email, firstName, lastName },
                });
            }
            catch (error) {
                // handle errors here including duplicate email for registration of any taken email ---
                console.error("Registration Error:", error);
                return res.status(500).json({
                    code: 500,
                    message: "An error occurred during registration",
                });
            }
        });
    }
}
exports.default = AuthController;
