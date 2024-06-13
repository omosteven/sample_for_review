import { Request, Response } from "express";

import ResponseHandler from "../../utils/resp-handlers";

import TagsModel from "../../models/posts/tags.model";

import Helpers from "../../helpers";

import { MODEL_NAMES } from "../../enums";

const { TAGS } = MODEL_NAMES;

const responseHandlers = new ResponseHandler();

const helpers = new Helpers();

class TagsController {
  async fetchAllTags(req: Request, res: Response) {
    const { filter } = helpers.pagination(req, "tagName");

    try {
      // --- fetch all tags  with the filter and do not return their posts  ---
      const allTags = await TagsModel.find(filter).select("-posts");

      return responseHandlers.success(res, allTags);
    } catch (error) {
      return await responseHandlers.mongoError(req, res, error, TAGS);
    }
  }
}

export default TagsController;
