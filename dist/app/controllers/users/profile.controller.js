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
const users_model_1 = __importDefault(require("../../models/users/users.model"));
const resp_handlers_1 = __importDefault(require("../../utils/resp-handlers"));
const helpers_1 = __importDefault(require("../../helpers"));
const responseHandlers = new resp_handlers_1.default();
const helpers = new helpers_1.default();
class ProfileController {
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            try {
                // --- find the user by its userId and  exclude password and token in the result ---
                const user = yield users_model_1.default.findById(userId).select("-password -token");
                // ---check and throw this if the userid does not match a record ---
                if (!user) {
                    return responseHandlers.error(res, "User Not Found", 404);
                }
                return responseHandlers.success(res, user);
            }
            catch (error) {
                // in  case an  error occuurs
                return responseHandlers.error(res, "An error occurred", 500, error);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, country, language, picture } = req.body;
            const { userId } = req.body.user;
            try {
                // --- check if the required payloads(only firstName and lastName) pass the neccessary validations ---
                const { isValid, errorMessage } = helpers.validatePayloads(req.body, [
                    "firstName",
                    "lastName",
                ]);
                if (!isValid) {
                    return responseHandlers.error(res, errorMessage);
                }
                // --- the  picture is meant to be a direct  url to  the actual image ---
                // --- actual image is handle by the media upload endpoint ---
                const updateData = { firstName, lastName, country, language, picture };
                // --- update the user record and exclude password and token from the result ---
                const updatedUser = yield users_model_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true, select: "-password -token" });
                // --- check and throw this if the user update fails ---
                if (!updatedUser) {
                    return responseHandlers.error(res, "User Not Found", 404);
                }
                return responseHandlers.success(res, updatedUser, "User profile updated successfully", 201);
            }
            catch (error) {
                // in  case an  error occurs
                return responseHandlers.error(res, "An error occurred", 500, error);
            }
        });
    }
    deletePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            try {
                // --- update the picture field of the user record to empty string straighaway  ----
                const updateResult = yield users_model_1.default.updateOne({ _id: userId }, { picture: "" });
                // --- check  if the modification fails or not  ----
                if (updateResult.modifiedCount === 0) {
                    return responseHandlers.error(res, "User Not Found", 404);
                }
                return responseHandlers.success(res, undefined, "User picture deleted successfully", 200);
            }
            catch (error) {
                // in  case an  error occurs
                return responseHandlers.error(res, "An error occurred", 500, error);
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            try {
                // --- delete the user record straighaway  ----
                const deleteResult = yield users_model_1.default.deleteOne({ _id: userId });
                // --- check  if a user record was deleted or not  ----
                if (deleteResult.deletedCount === 0) {
                    return responseHandlers.error(res, "User Not Found", 404);
                }
                return responseHandlers.success(res, undefined, "User deleted successfully", 200);
            }
            catch (error) {
                // in  case an  error occurs
                return responseHandlers.error(res, "An error occurred", 500, error);
            }
        });
    }
    deactivateAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body.user;
            try {
                // --- set the user isActive to false and clear their user token ---
                const updateData = { isActive: false, token: "" };
                // --- update  the user details here  ----
                const updatedUser = yield users_model_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true, select: "-password -token" });
                // --- check and throw this if the user record update fails ---
                if (!updatedUser) {
                    return responseHandlers.error(res, "User Not Found", 404);
                }
                return responseHandlers.success(res, updatedUser, "User deactivated successfully", 201);
            }
            catch (error) {
                // in  case an  error occurs
                return responseHandlers.error(res, "An error occurred", 500, error);
            }
        });
    }
}
exports.default = ProfileController;
