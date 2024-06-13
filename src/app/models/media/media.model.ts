import { Schema, model, Document } from "mongoose";

import { MEDIA_TYPE_NAMES, MODEL_NAMES } from "../../enums";

const { ObjectId, String } = Schema.Types;

const { USERS, MEDIA } = MODEL_NAMES;

interface IMedia extends Document {
  fileName: string;
  uploadedBy: string;
  fileSize: string;
  fileUrl: string;
  fileType: string;
}

const mediaSchema = new Schema(
  {
    fileName: {
      type: String,

      required: true,
    },

    uploadedBy: {
      type: ObjectId,

      ref: USERS,

      required: true,
    },

    fileUrl: {
      type: String,

      required: true,
    },

    fileSize: {
      type: String,

      required: true,
    },

    fileType: {
      type: String,

      enum: MEDIA_TYPE_NAMES,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mediaModel = model<IMedia>(MEDIA, mediaSchema);

export default mediaModel;
