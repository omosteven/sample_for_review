import { Router } from "express";

import { CommentsController, TagsController } from "../controllers";

import auth from "../middleware/auth.middleware";

const router = Router();

const tagsController = new TagsController();
const commentsController = new CommentsController();

const commentsRoute = () => {
  router.get("/tags", auth, tagsController.fetchAllTags);
  router.post("/posts/comments/:postId",auth,commentsController.addCommentToPost);
  router.put("/posts/comments/:commentId",auth,commentsController.editCommentById);
  router.delete("/posts/comments/:commentId",auth,commentsController.deleteCommentById);
  router.get("/posts/comments/:postId",auth,commentsController.fetchAllCommentsByPostId);
  
  return router;
};

export default commentsRoute;
