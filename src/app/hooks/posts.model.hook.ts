import { Schema, Document } from "mongoose";

import {
  NEW_POST_CREATION,
  POST_REMOVAL,
  POST_UPDATE,
} from "../../socket/events";

import { IPostModel } from "../types/posts/posts.types";

import { io } from "../../socket";

const postsModelHook = (schema: Schema<Document>) => {
  // emit this event whenever a new post comes
  schema.post<IPostModel>("save", function (doc) {
    io.emit(NEW_POST_CREATION, doc);
  });

  //   emit  this event whenever a post is deleted
  schema.post<IPostModel>("findOneAndDelete", function (doc) {
    io.emit(POST_REMOVAL, doc);
  });

  //  emit this socket event whenever a post gets a new like, new comment, or edited
  schema.post<IPostModel>("findOneAndUpdate", function (doc) {
    io.emit(POST_UPDATE, doc);
  });
};

export default postsModelHook;
