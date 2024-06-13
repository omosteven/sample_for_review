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
const mongoose_1 = __importDefault(require("mongoose"));
const errors_logs_model_1 = __importDefault(require("../../models/logs/errors.logs.model"));
class ResponseHandler {
    success(res, data, message, code = 200) {
        return res.status(code).json({
            code: code,
            message: message || "Success",
            data,
        });
    }
    error(res, message, code = 400, error) {
        return res.status(code).json({
            code: code,
            message: message || "Error",
        });
    }
    mongoError(req, res, err, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            let code = 500;
            let message = "An unexpected error occurred";
            const { userId } = req.body.user || {};
            const errorDetails = {
                userId,
                collectionName,
                errorMessage: message,
                errorStack: err.stack,
                errorName: err.name,
            };
            // --- for handling Mongoose validation errors ---
            if (err instanceof mongoose_1.default.Error.ValidationError) {
                code = 400;
                message = "Validation error";
                errorDetails.errorMessage = message;
                errorDetails.validationErrors = Object.values(err.errors).map((error) => error.message);
                yield new errors_logs_model_1.default(errorDetails).save();
                return res.status(code).json({
                    message,
                    code: code,
                    details: errorDetails.validationErrors,
                });
            }
            // --- for handling Mongoose duplicate key errors ---
            if (err.code && err.code === 11000) {
                code = 409; // Conflict
                const field = Object.keys(err.keyValue)[0];
                message = `An existing record is already associated with this ${field}`;
                errorDetails.errorMessage = message;
                yield new errors_logs_model_1.default(errorDetails).save();
                return res.status(code).json({
                    message,
                    code,
                });
            }
            // Handle other Mongoose errors
            if (err instanceof mongoose_1.default.Error) {
                code = 400;
                message = err.message;
                errorDetails.errorMessage = message;
                yield new errors_logs_model_1.default(errorDetails).save();
                return res.status(code).json({
                    message,
                    code,
                });
            }
            errorDetails.errorMessage = message;
            yield new errors_logs_model_1.default(errorDetails).save();
            return res.status(code).json({
                message,
                code,
            });
        });
    }
}
exports.default = ResponseHandler;
