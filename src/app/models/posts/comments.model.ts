import { Schema, model } from "mongoose";

import { MODEL_NAMES } from "../../enums";

import { ICommentModel } from "../../types/posts/posts.types";

import commentsModelHook from "../../hooks/comments.model.hook";

const { ObjectId, String } = Schema.Types;

const { COMMENTS, USERS, POSTS } = MODEL_NAMES;

const commentsSchema = new Schema(
  {
    post: {
      type: ObjectId,

      ref: POSTS,

      required: true,
    },

    user: {
      type: ObjectId,

      ref: USERS,

      required: true,
    },

    content: {
      type: String,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

commentsModelHook(commentsSchema);

const CommentsModel = model<ICommentModel>(COMMENTS, commentsSchema);

export default CommentsModel;
