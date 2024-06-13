import { Request, Response } from "express";

import ResponseHandler from "../../utils/resp-handlers";

import TagsModel from "../../models/posts/tags.model";

import Helpers from "../../helpers";

const responseHandlers = new ResponseHandler();

const helpers = new Helpers();

class TagsController {
  async fetchAllTags(req: Request, res: Response) {
    const { filter } = helpers.pagination(req, "tagName");

    try {
      const allTags = await TagsModel.find(filter).select("-posts");

      return responseHandlers.success(res, allTags);
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }
}

export default TagsController;