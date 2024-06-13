import { Request, Response } from "express";

import { IUser, IUserId } from "../../types/users/users.types";

import UsersModel from "../../models/users/users.model";

import ResponseHandler from "../../utils/resp-handlers";

import Helpers from "../../helpers";

const responseHandlers = new ResponseHandler();

const helpers = new Helpers();

class ProfileController {
  async getProfile(req: Request, res: Response) {
    const { userId }: IUserId = req.body.user;

    try {
      // --- find the user by its userId and  exclude password and token in the result ---
      const user = await UsersModel.findById(userId).select("-password -token");

      // ---check and throw this if the userid does not match a record ---
      if (!user) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(res, user);
    } catch (error) {
      // in  case an  error occuurs
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async updateProfile(req: Request, res: Response) {
    const { firstName, lastName, country, language, picture }: IUser = req.body;

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
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, select: "-password -token" }
      );

      // --- check and throw this if the user update fails ---
      if (!updatedUser) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        updatedUser,
        "User profile updated successfully",
        201
      );
    } catch (error) {
      // in  case an  error occurs
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deletePicture(req: Request, res: Response) {
    const { userId }: IUserId = req.body.user;

    try {
      // --- update the picture field of the user record to empty string straighaway  ----
      const updateResult = await UsersModel.updateOne(
        { _id: userId },
        { picture: "" }
      );

      // --- check  if the modification fails or not  ----
      if (updateResult.modifiedCount === 0) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        undefined,
        "User picture deleted successfully",
        200
      );
    } catch (error) {
      // in  case an  error occurs
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deleteAccount(req: Request, res: Response) {
    const { userId }: IUserId = req.body.user;

    try {
      // --- delete the user record straighaway  ----
      const deleteResult = await UsersModel.deleteOne({ _id: userId });

      // --- check  if a user record was deleted or not  ----
      if (deleteResult.deletedCount === 0) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        undefined,
        "User deleted successfully",
        200
      );
    } catch (error) {
      // in  case an  error occurs
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deactivateAccount(req: Request, res: Response) {
    const { userId }: IUserId = req.body.user;

    try {
      // --- set the user isActive to false and clear their user token ---
      const updateData = { isActive: false, token: "" };

      // --- update  the user details here  ----
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, select: "-password -token" }
      );

      // --- check and throw this if the user record update fails ---
      if (!updatedUser) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        updatedUser,
        "User deactivated successfully",
        201
      );
    } catch (error) {
      // in  case an  error occurs
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }
}

export default ProfileController;
