import { Schema, model, Document } from "mongoose";

import { MODEL_NAMES } from "../../enums";

const { String } = Schema.Types;

const { USERS } = MODEL_NAMES;

interface IUser extends Document {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  country: string;
  language: string;
  password: string;
  isActive: boolean;
  token: string;
}

const usersSchema = new Schema(
  {
    email: {
      type: String,

      required: true,

      unique: true,

      // --- throws error if the record doesn't conform with email ---
      match: /.+\@.+\..+/,
    },

    firstName: {
      type: String,

      required: true,
    },

    lastName: {
      type: String,

      required: true,
    },

    picture: {
      type: String,

      default: "",
    },

    country: {
      type: String,

      default: "Nigeria",
    },

    language: {
      type: String,

      default: "English",
    },

    password: {
      type: String,

      minLength: 8,

      required: true,
    },

    isActive: {
      type: Boolean,

      // default this to true for every newly signedin user
      default: true,
    },

    token: {
      type: String,

      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UsersModel = model<IUser>(USERS, usersSchema);

export default UsersModel;
