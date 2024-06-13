import { Request, Response } from "express";

import mongoose from "mongoose";

import ErrorLogModel from "../../models/logs/errors.logs.model";

interface ErrorDetails {
  userId?: any;
  collectionName?: string;
  errorMessage: string;
  errorStack: any;
  errorName: any;
  validationErrors?: string[];
}

class ResponseHandler {
  success(res: Response, data: any, message?: string, code: number = 200) {
    return res.status(code).json({
      code: code,
      message: message || "Success",
      data,
    });
  }

  error(res: Response, message?: string, code: number = 400, error?: any) {
    return res.status(code).json({
      code: code,
      message: message || "Error",
    });
  }

  async mongoError(
    req: Request,
    res: Response,
    err: any,
    collectionName?: string
  ) {
    let code = 500;
    let message = "An unexpected error occurred";

    const { userId } = req.body.user || {};

    const errorDetails: ErrorDetails = {
      userId,
      collectionName,
      errorMessage: message,
      errorStack: err.stack,
      errorName: err.name,
    };

    // --- for handling Mongoose validation errors ---
    if (err instanceof mongoose.Error.ValidationError) {
      code = 400;
      message = "Validation error";

      errorDetails.errorMessage = message;
      errorDetails.validationErrors = Object.values(err.errors).map(
        (error: any) => error.message
      );

      await new ErrorLogModel(errorDetails).save();

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

      await new ErrorLogModel(errorDetails).save();

      return res.status(code).json({
        message,
        code,
      });
    }

    // Handle other Mongoose errors
    if (err instanceof mongoose.Error) {
      code = 400;
      message = err.message;
      errorDetails.errorMessage = message;

      await new ErrorLogModel(errorDetails).save();

      return res.status(code).json({
        message,
        code,
      });
    }

    errorDetails.errorMessage = message;
    await new ErrorLogModel(errorDetails).save();

    return res.status(code).json({
      message,
      code,
    });
  }
}

export default ResponseHandler;
