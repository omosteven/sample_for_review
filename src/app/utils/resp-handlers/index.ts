import { Request, Response } from "express";

// import { Error as MongooseError } from "mongoose";

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

  // mongoError(error: MongooseError){
  //   if (error.name === 'MongoError' && error?.code === 11000) {
  //     const field = Object.keys(error.keyPattern)[0];
  //     const value = error.keyValue[field];
  //     const message = `${field} with value ${value} already exists.`;
  //     return { message, path: field, value };
  //   }
  //   return null;
  // }
}

export default ResponseHandler;
