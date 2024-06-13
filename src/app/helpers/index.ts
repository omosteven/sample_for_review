import jwt from "jsonwebtoken";

import { Request } from "express";

import bcrypt from "bcrypt";

import { ObjectId } from "mongodb";

import config from "../../config/config";

import {
  IValidatePayloadParams,
  IValidatePayloadResponse,
} from "../types/helpers/helpers.types";

class Helpers {
  // Method to generate a JWT token for a given email
  async generateToken(email: string, userId: string) {
    const jwtKey = config("jwt_key");
    const jwtExpirySeconds = 604800; // Token expiration time set to one week (in seconds)

    const token = jwt.sign({ email, userId }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });

    return token;
  }

  // Method to hash a given password
  hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    return hashedPassword;
  }

  // Method to compare two passwords
  async comparePasswords(password: string, hashedPassword: string) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }

  validatePayloads(
    payloads: any,
    validators: string[],
    rules?: object
  ): IValidatePayloadResponse {
    let isValid = true;

    for (let v = 0; v < validators?.length; v++) {
      isValid = Boolean(payloads?.[validators[v]]);

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
      console.log("not meant");
      isValid = payloads["password"]?.length >= 8;
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

  async mongoDBErrorHandler(mongoDBError: any) {}

  areHashtagsValid(hashTags: string[]): boolean {
    if (!Array.isArray(hashTags)) {
      return false; // Ensure the input is an array
    }

    return hashTags.every(
      (hashTag) => typeof hashTag === "string" && hashTag.startsWith("#")
    );
  }

  pagination(req: Request, keyword: string) {
    let { pageSize = 10, currentPage = 1, search = "" } = req.query;

    pageSize = parseInt(pageSize as string, 10);

    currentPage = parseInt(currentPage as string, 10);

    const searchQuery = (search as string).trim();

    // Create a search filter
    const filter = searchQuery
      ? { [keyword]: { $regex: searchQuery, $options: "i" } }
      : {};

    return { pageSize, currentPage, filter };
  }

  isObjectIdValid(id: string): boolean {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
  }
}

export default Helpers;

// [
//   {
//     payload: "email",
//     rule: /.+\@.+\..+/,
//     type: "REGEX",
//   },
//   {
//     payload:'password',
//     rule:'minLength'
//   },

// ]
