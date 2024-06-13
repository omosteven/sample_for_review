import { Schema, model, Document } from "mongoose";

import { MODEL_NAMES } from "../../enums";

const { String, ObjectId } = Schema.Types;

const { USERS, ERROR_LOGS } = MODEL_NAMES;

interface IErrorLog extends Document {
  errorMessage: string;
  collectionName?: string;
  userId?: string;
  errorStack?: string;
}

const errorLogSchema = new Schema<IErrorLog>(
  {
    errorMessage: {
      type: String,
      required: true,
    },

    errorStack: {
      type: String,
    },

    collectionName: {
      type: String,
      required: false,
    },
    userId: {
      type: ObjectId,
      ref: USERS,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ErrorLogModel = model<IErrorLog>(ERROR_LOGS, errorLogSchema);

export default ErrorLogModel;
