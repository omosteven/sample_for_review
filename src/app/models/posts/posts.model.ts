import { Schema, model } from "mongoose";

import { MODEL_NAMES, MEDIA_TYPE_NAMES } from "../../enums";

import { IPostModel } from "../../types/posts/posts.types";

import postsModelHook from "../../hooks/posts.model.hook";

const { ObjectId, String } = Schema.Types;

const { USERS, POSTS } = MODEL_NAMES;

const postsSchema = new Schema(
  {
    content: {
      type: String,

      required: true,
    },

    madeBy: {
      // --- reference to the UserId ---
      type: ObjectId,

      ref: USERS,

      required: true,
    },

    mediaUrl: {
      type: String,
    },

    mediaType: {
      type: String,

      enum: MEDIA_TYPE_NAMES,
    },

    canBeLiked: {
      type: Boolean,

      default: true,
    },

    allowsComments: {
      type: Boolean,

      default: true,
    },

    tags: [String],

    likes: [
      {
        type: ObjectId,

        ref: USERS,
      },
    ],

    // comments: [
    //   {
    //     type: ObjectId,

    //     ref: COMMENTS,
    //   },
    // ],

    noOfLikes: {
      type: Number,

      default: 0,
    },

    noOfComments: {
      type: Number,

      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

postsModelHook(postsSchema);

const PostsModel = model<IPostModel>(POSTS, postsSchema);

export default PostsModel;
