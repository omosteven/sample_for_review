import { Request, Response } from "express";

import {
  IUpdatePassword,
  IUserLogin,
  IUserRegister,
} from "../../types/users/users.types";

import UsersModel from "../../models/users/users.model";

import Helpers from "../../helpers";

import ResponseHandler from "../../utils/resp-handlers";

const helpers = new Helpers();

const responseHandlers = new ResponseHandler();
/**
  @param {Request} req
  
  @param {Response}  res

  @returns
**/

class AuthController {
  // -- login -- function
  async login(req: Request, res: Response) {
    const { email, password }: IUserLogin = req.body;

    // --- wrap the DB queries inside try and catch to catch  errors

    try {
      // --- check if  the payloads pass the neccessary validations ---
      const { isValid, errorMessage } = helpers.validatePayloads(req.body, [
        "email",
        "password",
      ]);

      if (!isValid) {
        return responseHandlers.error(res, errorMessage);
      }

      const user = await UsersModel.findOne({ email });

      // --- check if a  user  is found or not
      if (!user) {
        return responseHandlers.error(res, "Email or password invalid");
      }

      // --- compare the found user's password with the inputed password
      const doPasswordsMatch = await helpers.comparePasswords(
        password,
        user.password
      );

      if (!doPasswordsMatch) {
        return responseHandlers.error(res, "Email or password invalid");
      }

      // --- generate a user token for  the user ---
      const newToken = await helpers.generateToken(email, user?._id);

      // --- update the  user token of the user in their respective DB record ---
      await UsersModel.updateOne({ email }, { token: newToken });

      // Convert the user document to an object
      // let { password:_, ...rest } = user;
      user.token = newToken;
      // --- respond back ---
      return responseHandlers.success(res, user, "Login successful");
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({
        code: 500,
        message: "An error occurred during login",
      });
    }
  }

  // --- register user  function ---
  async register(req: Request, res: Response) {
    const { email, password, firstName, lastName }: IUserRegister = req.body;
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
      const hashedPassword = helpers.hashPassword(password);

      // --- initiate the Users Model ---
      const newUser = new UsersModel({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      //   --- save the user record if payload/field requirements are passed ---
      await newUser.save();

      return responseHandlers.success(
        res,
        { email, firstName, lastName },
        "Account created successfully",
        201
      );
    } catch (error) {
      // handle errors here including duplicate email for registration of any taken email ---
      return res.status(500).json({
        code: 500,
        message: "An error occurred during registration",
      });
    }
  }

  async updatePassword(req: Request, res: Request) {
    const { newPassword }: IUpdatePassword = req.body;

    // console.log('req', req?.user);
  }
}

export default AuthController;
