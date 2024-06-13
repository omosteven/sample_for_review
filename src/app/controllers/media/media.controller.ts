import { Request, Response } from "express";

import ResponseHandler from "../../utils/resp-handlers";

import mediaModel from "../../models/media/media.model";

const responseHandlers = new ResponseHandler();

class MediaController {
  async uploadMedia(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { fileName, fileType, fileSize, fileUrl } = req.body.uploadedFileInfo;

    try {
      // --- the main purpose of storing this to  the DB is to keep track of uploaded files ---
      const saveMedia = new mediaModel({
        fileName,
        fileType,
        fileSize,
        fileUrl,
        uploadedBy: userId,
      });

      await saveMedia.save();

      return responseHandlers.success(res, {
        fileName,
        fileType,
        fileSize,
        fileUrl,
        _id: saveMedia._id,
      });
    } catch (error) {
      return responseHandlers.error(res, "An error occurred");
    }
  }

  //   async getFileInfo(req: Request, res: Response) {}
}

export default MediaController;
