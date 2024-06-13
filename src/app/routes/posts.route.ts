import { Router } from "express";

import { PostsController } from "../controllers";

import auth from "../middleware/auth.middleware";

const router = Router();

const postsController = new PostsController();

const postsRoute = () => {
  router.post("/posts/create", auth, postsController.createPost);
  router.get("/posts/mine", auth, postsController.fetchMyPosts);
  router.get("/posts", auth, postsController.fetchAllPosts);
  router.get("/posts/tags", auth, postsController.searchPostsByTag);
  router.get("/posts/:postId", auth, postsController.fetchPostById);
  router.patch("/posts/:postId", auth, postsController.editPost);
  router.delete("/posts/:postId", auth, postsController.deletePost);
  router.put("/posts/like/:postId", auth, postsController.likeAPost);
  
  return router;
};

export default postsRoute;
