import { Schema, Document } from "mongoose";

import {
  NEW_POST_COMMENT,
  POST_COMMENT_REMOVAL,
  POST_COMMENT_UPDATE,
} from "../../socket/events";

import { ICommentModel } from "../types/posts/posts.types";

import { io } from "../../socket";

const commentsModelHook = (schema: Schema<Document>) => {
  // emit this event whenever a post gets a new comment
  schema.post<ICommentModel>("save", function (doc) {
    io.emit(NEW_POST_COMMENT, doc);
  });

  // emit  this event whenever a comment is deleted
  schema.post<ICommentModel>("findOneAndDelete", function (doc) {
    io.emit(POST_COMMENT_REMOVAL, doc);
  });

  //  emit this socket event whenever a comment is edited
  schema.post<ICommentModel>("findOneAndUpdate", function (doc) {
    io.emit(POST_COMMENT_UPDATE, doc);
  });
};

export default commentsModelHook;
