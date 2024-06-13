import { Schema, model, Document } from "mongoose";

import { MODEL_NAMES } from "../../enums";

const { ObjectId, String } = Schema.Types;

const { COMMENTS, USERS, POSTS } = MODEL_NAMES;

interface IComment extends Document {
  post: string;
  user: string;
  content: string;
}

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

const CommentsModel = model<IComment>(COMMENTS, commentsSchema);

export default CommentsModel;
