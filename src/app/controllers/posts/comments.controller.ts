import { Request, Response } from "express";

import ResponseHandler from "../../utils/resp-handlers";

import Helpers from "../../helpers";

import CommentsModel from "../../models/posts/comments.model";

import PostsModel from "../../models/posts/posts.model";

import { IComment, ICommentId, IPostId } from "../../types/posts/posts.types";

import { MODEL_NAMES } from "../../enums";

const { COMMENTS } = MODEL_NAMES;

const responseHandlers = new ResponseHandler();

const helpers = new Helpers();

class CommentsController {
  async addCommentToPost(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { postId } = req.params as unknown as IPostId;

    const { content }: IComment = req.body;

    try {
      // --- check if content is empty or not ---
      if (!helpers.isStringEmpty(content)) {
        return responseHandlers.error(res, "Please add a comment content");
      }

      // --- check if postId is a valid object
      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid post id");
      }

      // --- retrive the actual post and only return allowsComments, noOfComments
      const post = await PostsModel.findById(postId).select(
        "allowsComments noOfComments"
      );

      if (!post) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      // --- perform authorization to check if the post is allowed to have comments or not ---
      if (!post.allowsComments) {
        return responseHandlers.error(
          res,
          "Unauthorized: Post does not allow comments",
          401
        );
      }

      const newComment = new CommentsModel({
        post: postId,
        content,
        user: userId,
      });

      (await newComment.save()).populate({
        path: "user",
        select: "email firstName _id lastName picture",
      });

      // --- increment number of comments ---
      post.noOfComments++;
      post.save();

      return responseHandlers.success(res, newComment, "Comment added", 201);
    } catch (error) {
      return await responseHandlers.mongoError(req, res, error, COMMENTS);
    }
  }

  async editCommentById(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { commentId } = req.params as unknown as ICommentId;

    const { content }: IComment = req.body;

    try {
      // --- check if  the content has value ---
      if (!helpers.isStringEmpty(content)) {
        return responseHandlers.error(res, "Comment cannot be empty");
      }

      // --- retrive and update the comment, also populate it with the actual user performing the edit action ---
      const updatedComment = await CommentsModel.findOneAndUpdate(
        {
          _id: commentId,
          user: userId,
        },
        { $set: { content } },
        { new: true }
      ).populate({
        path: "user",
        select: "email firstName _id lastName picture",
      });

      if (!commentId || !helpers.isObjectIdValid(commentId)) {
        return responseHandlers.error(res, "Invalid comment id");
      }

      if (!updatedComment) {
        return responseHandlers.error(res, "Failed to update comment");
      }

      return responseHandlers.success(
        res,
        updatedComment,
        "Comment updated",
        201
      );
    } catch (error) {
      return responseHandlers.mongoError(req, res, error, COMMENTS);
    }
  }

  async deleteCommentById(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { commentId } = req.params as unknown as ICommentId;

    try {
      if (!commentId || !helpers.isObjectIdValid(commentId)) {
        return responseHandlers.error(res, "Invalid comment id");
      }

      // --- we assume the comment was made by the user ---
      // --- checking separately if it was made by the user using another query operation  will increase the request time ---
      const commentToDelete = await CommentsModel.deleteOne({
        _id: commentId,
        user: userId,
      });

      // --- was there a successful  delete operation? ---
      if (commentToDelete.deletedCount === 0) {
        return responseHandlers.error(res, "Failed to delete comment");
      }

      return responseHandlers.success(
        res,
        undefined,
        "Post delete successfully",
        200
      );
    } catch (error) {
      return responseHandlers.mongoError(req, res, error, COMMENTS);
    }
  }

  async fetchAllCommentsByPostId(req: Request, res: Response) {
    const { postId }: any = req.params;

    try {
      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid comment id");
      }

      const comments = await CommentsModel.find({ post: postId }).populate({
        path: "user",
        select: "email firstName _id lastName picture",
      });

      return responseHandlers.success(res, comments || []);
    } catch (error) {
      return responseHandlers.mongoError(req, res, error, COMMENTS);
    }
  }
}

export default CommentsController;
