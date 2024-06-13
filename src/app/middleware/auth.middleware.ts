import { Request, Response, NextFunction } from "express";

import UsersModel from "../models/users/users.model";

import Helpers from "../helpers";

const helpers = new Helpers();

const auth = async (req: Request, res: Response, next: NextFunction) => {
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

    const fetchedUser = await UsersModel.findById(decodedToken?.userId).select(
      "token password"
    );

    if (fetchedUser?.token !== token) {
      return res.status(401).json({
        code: 401,
        message: "Unauthorized: invalid Token",
      });
    }

    // --- only run if the user is on this route ---
    if (req.route.path === "/auth/change-password") {
      const { oldPassword, newPassword } = req.body || {};
      if (
        helpers.isStringEmpty(oldPassword, 7) ||
        helpers.isStringEmpty(newPassword, 7)
      ) {
        return res.status(401).json({
          code: 401,
          message:
            "One or both passwords are missing or not up to 8 characters",
        });
      }

      // --- compare the found user's password with the inputed password ---
      const doPasswordsMatch = await helpers.comparePasswords(
        oldPassword,
        fetchedUser.password
      );

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
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized",
    });
  }
};

export default auth;
