import { Request, Response } from "express";

import ResponseHandler from "../../utils/resp-handlers";

import PostsModel from "../../models/posts/posts.model";

import TagsModel from "../../models/posts/tags.model";

import { IPost } from "../../types/posts/posts.types";

import Helpers from "../../helpers";

const helpers = new Helpers();

const responseHandlers = new ResponseHandler();

class PostsController {
  async createPost(req: Request, res: Response) {
    const {
      content,
      mediaUrl,
      mediaType,
      canBeLiked,
      allowsComments,
      tags = [],
    }: IPost = req.body;
    const { userId } = req.body.user;

    try {
      // --- check if  the payloads pass the neccessary validations ---
      const { isValid, errorMessage } = helpers.validatePayloads(req.body, [
        "content",
      ]);

      if (!isValid) {
        return responseHandlers.error(res, errorMessage);
      }

      // --- check if tags are present in the post ---
      let hasHashTags = tags?.length > 0;

      if (hasHashTags) {
        if (!helpers.areHashtagsValid(tags)) {
          return responseHandlers.error(res, "Invalid hash tags");
        }
      }

      // --- initiate the Posts Model ---
      const newPost = new PostsModel({
        content,
        mediaUrl,
        mediaType,
        canBeLiked,
        allowsComments,
        tags,
        madeBy: userId,
      });

      const savedPost = await newPost.save();

      if (hasHashTags) {
        const tagPromises = tags.map(async (tagName: string) => {
          let tag = await TagsModel.findOneAndUpdate(
            { tagName },
            { $addToSet: { posts: savedPost._id } },
            { new: true, upsert: true } // upsert is set to true to ensure new tag records are created if no existing ones
          );

          return tag.tagName;
        });

        const tagNames = await Promise.all(tagPromises);
        savedPost.tags = tagNames;
      }

      await savedPost.save();

      return responseHandlers.success(
        res,
        savedPost,
        "Post created successfully",
        201
      );
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async editPost(req: Request, res: Response) {
    const {
      content,
      mediaUrl,
      mediaType,
      canBeLiked,
      allowsComments,
      tags = [],
    }: IPost = req.body;

    const updateData = {
      content,
      mediaUrl,
      mediaType,
      canBeLiked,
      allowsComments,
      tags,
    };

    const { userId } = req.body.user;

    const { postId }: any = req.params;

    try {
      // --- validate the  post id  ---
      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid post id");
      }

      // Check if the user is authorized to update the post
      const postToUpdate = await PostsModel.findOne({ _id: postId }).select(
        "madeBy"
      );

      if (!postToUpdate) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      if (postToUpdate.madeBy.toString() !== userId) {
        return responseHandlers.error(
          res,
          "Unauthorized: User is not the author of this post",
          401
        );
      }

      // --- check if tags are present in the post ---
      let hasHashTags = tags?.length > 0;

      if (hasHashTags) {
        if (!helpers.areHashtagsValid(tags)) {
          return responseHandlers.error(res, "Invalid hash tags");
        }
      }

      // --- update the  post by  post id ---
      const updatedPost = await PostsModel.findOneAndUpdate(
        { _id: postId, madeBy: userId },
        {
          $set: updateData,
        },
        {
          new: true,
        }
      );

      if (!updatedPost) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      if (hasHashTags) {
        const tagPromises = tags.map(async (tagName: string) => {
          let tag = await TagsModel.findOneAndUpdate(
            { tagName },
            { $addToSet: { posts: postId } },
            { new: true, upsert: true } // upsert is set to true to ensure new tag records are created if no existing ones
          );

          return tag.tagName;
        });

        await Promise.all(tagPromises);
      }

      return responseHandlers.success(
        res,
        updatedPost,
        "Post updated successfully",
        201
      );
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async deletePost(req: Request, res: Response) {
    const { userId } = req.body.user;

    const { postId }: any = req.params;

    try {
      // --- validate the  post id  ---
      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid post id");
      }

      // Check if the user is authorized to update the post
      const postToUpdate = await PostsModel.findOne({ _id: postId }).select(
        "madeBy tags"
      );

      if (!postToUpdate) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      if (postToUpdate.madeBy.toString() !== userId) {
        return responseHandlers.error(
          res,
          "Unauthorized: User is not the author of this post",
          401
        );
      }

      const deletedPost = await PostsModel.deleteOne({ _id: postId });

      // --- if no post is delated ---
      if (deletedPost?.deletedCount === 0) {
        return responseHandlers.error(res, "An error occurred", 400);
      }

      const hashTags = postToUpdate.tags;

      if (hashTags.length > 0) {
        const tagPromises = hashTags.map(async (tagName: string) => {
          let tag = await TagsModel.findOneAndUpdate(
            { tagName },
            { $pull: { posts: postId } },
            { new: true }
          );

          return tag?.tagName;
        });

        await Promise.all(tagPromises);
      }

      // --- it might be nice to delete all comments tied to a post but these comments may be  useful as data in future ---

      return responseHandlers.success(
        res,
        undefined,
        "Post deleted successfully",
        200
      );
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async fetchAllPosts(req: Request, res: Response) {
    // --- retrieve the  pagination parameters
    const { pageSize, currentPage, filter } = helpers.pagination(
      req,
      "content"
    );

    try {
      // --- count number of records in the model
      const totalRecords = await PostsModel.countDocuments(filter);

      // --- retrieve the  records based  on the pagination parameters ---
      const posts = await PostsModel.find(filter)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate({
          path: "madeBy",
          select: "email firstName _id lastName picture",
        }); // Adjust sorting as needed;

      // --- calculate number of pages based  on  the  parameters  ---
      const totalPages = Math.ceil(totalRecords / pageSize);

      return responseHandlers.success(res, {
        records: posts,
        totalPages,
        currentPage,
        pageSize,
        totalRecords,
      });
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async fetchMyPosts(req: Request, res: Response) {
    const { userId } = req.body.user;

    // --- retrieve the  pagination parameters
    const { pageSize, currentPage, filter } = helpers.pagination(
      req,
      "content"
    );

    try {
      // --- count number of records in the model
      const totalRecords = await PostsModel.countDocuments(filter);

      // --- retrieve the  records based  on the pagination parameters ---
      const posts = await PostsModel.find({ madeBy: userId, ...filter })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate({
          path: "madeBy",
          select: "email firstName _id lastName picture",
        }); // Adjust sorting as needed;

      // --- calculate number of pages based  on  the  parameters  ---
      const totalPages = Math.ceil(totalRecords / pageSize);

      return responseHandlers.success(res, {
        records: posts,
        totalPages,
        currentPage,
        pageSize,
        totalRecords,
      });
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async fetchPostById(req: Request, res: Response) {
    const { postId }: any = req.params;

    try {
      // --- validate the  post id  ---
      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid post id");
      }

      const post = await PostsModel.findById(postId).populate({
        path: "madeBy",
        select: "email firstName _id lastName picture",
      });

      if (!post) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      return responseHandlers.success(res, post);
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  // --- this method handles both  like and unlike.  a post is unliked if called by a userId that  has  liked already ---
  async likeAPost(req: Request, res: Response) {
    const { postId } = req.params;
    const { userId } = req.body.user;

    try {
      // --- validate the  post id  ---
      if (!postId || !helpers.isObjectIdValid(postId)) {
        return responseHandlers.error(res, "Invalid post id");
      }

      const post = await PostsModel.findById(postId);

      if (!post) {
        return responseHandlers.error(res, "Post Not Found", 404);
      }

      // --- check if the post can be liked ---
      if (!post?.canBeLiked) {
        return responseHandlers.error(
          res,
          "Unauthorized: Post can not be liked",
          401
        );
      }

      // Check if the user has already liked the post
      const findUserLikedIndex = post.likes.findIndex((id) => id === userId);

      if (findUserLikedIndex === -1) {
        // if the user has not liked post
        // Add the userId to the likes array and increment noOfLikes
        post.likes.push(userId);

        post.noOfLikes++;
      } else {
        // remove the userId from the likes array and decrement noOfLikes
        post.likes.splice(findUserLikedIndex, 1);

        post.noOfLikes--;
      }

      // Save the updated post
      await post.save();

      return responseHandlers.success(res, post);
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }

  async searchPostsByTag(req: Request, res: Response) {
    // --- retrieve the  pagination parameters
    const { pageSize, currentPage } = helpers.pagination(req, "");

    const { tagName } = req.query;

    try {
      // const totalRecords = await PostsModel.populate("posts").countDocuments(filter);

      // --- check if tag is passed or not
      if (!tagName) {
        return responseHandlers.error(res, "Invalid Tag");
      }

      // --- retrieve the  records based  on the pagination parameters ---
      const tagPost = await TagsModel.findOne({
        tagName,
      }).populate({
        path: "posts",
        options: {
          skip: (currentPage - 1) * pageSize,
          limit: pageSize,
          sort: { createdAt: -1 }, // Sorting by creation date, adjust as needed
        },
      });

      const { posts } = tagPost || {};
      return responseHandlers.success(res, {
        records: posts || [],
        currentPage,
        pageSize,
      });
    } catch (error) {
      return responseHandlers.error(res, "An error occurred", 500, error);
    }
  }
}

export default PostsController;
