import { Schema, model, Document } from "mongoose";

import { MODEL_NAMES } from "../../enums";

const { String, ObjectId } = Schema.Types;

const { TAGS, POSTS } = MODEL_NAMES;

interface ITag extends Document {
  tagName: string;
  posts: string[];
}

const tagsSchema = new Schema(
  {
    tagName: {
      type: String,

      unique: true,

      required: true,
    },

    posts: [
      {
        type: ObjectId,

        ref: POSTS,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TagsModel = model<ITag>(TAGS, tagsSchema);

export default TagsModel;
