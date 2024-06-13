import { Request, Response } from "express";

import ResponseHandler from "../../utils/resp-handlers";

import Helpers from "../../helpers";

import CommentsModel from "../../models/posts/comments.model";

import PostsModel from "../../models/posts/posts.model";

const responseHandlers = new ResponseHandler();

const helpers = new Helpers();

class CommentsController {
  async addCommentToPost(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { postId }: any = req.params;

    const { content } = req.body;

    try {
      // --- check if the payloads pass the neccessary validations ---
      if (!content) {
        return responseHandlers.error(res, "Please add a comment content");
      }

      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid post id");
      }

      const post = await PostsModel.findById(postId).select("allowsComments");

      if (!post) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      // --- perform comment authorization here ---
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
      await PostsModel.updateOne(
        {
          _id: postId,
        },
        {
          $inc: {
            noOfComments: 1,
          },
        }
      );

      return responseHandlers.success(res, newComment, "Comment added", 201);
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async editCommentById(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { commentId }: any = req.params;

    const { content } = req.body;

    try {
      // --- check if  the payloads pass the neccessary validations ---
      if (!content) {
        return responseHandlers.error(res, "Comment cannot be empty");
      }

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
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deleteCommentById(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { commentId }: any = req.params;

    try {
      if (!commentId || !helpers.isObjectIdValid(commentId)) {
        return responseHandlers.error(res, "Invalid comment id");
      }

      // --- assume the comment was made by the user ---
      // --- checking separately if it was made by the user using another query operation  will increase the request time ---
      const commentToDelete = await CommentsModel.deleteOne({
        _id: commentId,
        user: userId,
      });

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
      return responseHandlers.error(res, "An error occurred", 500, error);
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
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }
}

export default CommentsController;
