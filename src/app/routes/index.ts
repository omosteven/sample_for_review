import { Router } from "express";

import AuthController from "../controllers/users/auth.controller";

import ProfileController from "../controllers/users/profile.controller";

import PostsController from "../controllers/posts/posts.controller";

import TagsController from "../controllers/posts/tags.controller";

import CommentsController from "../controllers/posts/comments.controller";

import auth from "../middleware/auth.middleware";

const router = Router();

const authController = new AuthController();

const profileController = new ProfileController();

const postsController = new PostsController();

const tagsController = new TagsController();

const commentsController = new CommentsController();

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);

router.get("/user/me", auth, profileController.getProfile);
router.patch("/user/me", auth, profileController.updateProfile);
router.delete("/user/me", auth, profileController.deleteAccount);
router.patch("/user/me/deactivate", auth, profileController.deactivateAccount);
router.delete("/user/me/picture", auth, profileController.deletePicture);

router.post("/posts/create", auth, postsController.createPost);
router.get("/posts/mine", auth, postsController.fetchMyPosts);
router.get("/posts", auth, postsController.fetchAllPosts);
router.get("/posts/:postId", auth, postsController.fetchPostById);
router.patch("/posts/:postId", auth, postsController.editPost);
router.delete("/posts/:postId", auth, postsController.deletePost);
router.put("/posts/like/:postId", auth, postsController.likeAPost);
router.get("/posts/tags", auth, postsController.searchPostsByTag);
router.get("/tags", auth, tagsController.fetchAllTags);

router.post("/posts/comments/:postId", auth, commentsController.addCommentToPost);
router.put("/posts/comments/:commentId", auth, commentsController.editCommentById);
router.delete("/posts/comments/:commentId", auth, commentsController.deleteCommentById);
router.get("/posts/comments/:postId", auth, commentsController.fetchAllCommentsByPostId);


export default router;
