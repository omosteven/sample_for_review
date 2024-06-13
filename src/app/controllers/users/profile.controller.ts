import { Request, Response } from "express";

import { IUser } from "../../types/users/users.types";

import UsersModel from "../../models/users/users.model";

import ResponseHandler from "../../utils/resp-handlers";

import Helpers from "../../helpers";

const responseHandlers = new ResponseHandler();

const helpers = new Helpers();

class ProfileController {
  async getProfile(req: Request, res: Response) {
    const { userId } = req.body.user;
    try {
      // find the user  by its userId
      const user = await UsersModel.findById(userId).select("-password -token");

      if (!user) {
        // check and throw this  if the useris not
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(res, user);
    } catch (error) {
      // in  case an  error occuured
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async updateProfile(req: Request, res: Response) {
    const { firstName, lastName, country, language, picture }: IUser = req.body;
    const { userId } = req.body.user;

    try {
      // --- check if the required payloads(firstName and lastName) pass the neccessary validations ---

      const { isValid, errorMessage } = helpers.validatePayloads(req.body, [
        "firstName",
        "lastName",
      ]);

      if (!isValid) {
        return responseHandlers.error(res, errorMessage);
      }

      // --- the  picture is meant to be a  direct  url to  the actual image ---
      const updateData = { firstName, lastName, country, language, picture };

      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, select: "-password -token" }
      );

      if (!updatedUser) {
        // check and throw this  if the user not updated
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        updatedUser,
        "User profile updated successfully",
        201
      );
    } catch (error) {
      // in  case an  error occuured
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deletePicture(req: Request, res: Response) {
    const { userId } = req.body.user;

    try {
      // --- delete the user record straighaway  ----
      const updateResult = await UsersModel.updateOne(
        { _id: userId },
        { picture: "" }
      );

      // --- check  if a record was deleted or not  ----
      if (updateResult.modifiedCount === 0) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        undefined,
        "User picture deleted successfully",
        204
      );
    } catch (error) {
      // in  case an  error occuured
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deleteAccount(req: Request, res: Response) {
    const { userId } = req.body.user;

    try {
      // --- delete the user record straighaway  ----
      const deleteResult = await UsersModel.deleteOne({ _id: userId });

      // --- check  if a record was deleted or not  ----
      if (deleteResult.deletedCount === 0) {
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        undefined,
        "User deleted successfully",
        204
      );
    } catch (error) {
      // in  case an  error occuured
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deactivateAccount(req: Request, res: Response) {
    const { userId } = req.body.user;

    try {
      // --- set the user isActive to false and clear their user token ---
      const updateData = { isActive: false, token: "" };

      // --- update  the user details here  ----
      const updatedUser = await UsersModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, select: "-password -token" }
      );

      if (!updatedUser) {
        // check and throw this  if the user not updated
        return responseHandlers.error(res, "User Not Found", 404);
      }

      return responseHandlers.success(
        res,
        updatedUser,
        "User deactivated successfully",
        201
      );
    } catch (error) {
      // in  case an  error occuured
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }
}

export default ProfileController;
