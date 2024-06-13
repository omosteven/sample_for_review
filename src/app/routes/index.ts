import { RequestHandler, Router } from "express";

import auth from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

import {
  AuthController,
  PostsController,
  ProfileController,
  TagsController,
  CommentsController,
  MediaController,
} from "../controllers";

const router = Router();

const controllers = {
  auth: new AuthController(),
  profile: new ProfileController(),
  posts: new PostsController(),
  tags: new TagsController(),
  comments: new CommentsController(),
  media: new MediaController(),
};

type RouteDefinition = {
  route: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  requireAuth: boolean;
  requireUpload?: boolean;
  controller: RequestHandler;
};

const routes: RouteDefinition[] = [
  {
    route: "/auth/login",
    method: "post",
    requireAuth: false,
    controller: controllers.auth.login,
  },
  {
    route: "/auth/register",
    method: "post",
    requireAuth: false,
    controller: controllers.auth.register,
  },
  {
    route: "/user/me",
    method: "get",
    requireAuth: true,
    controller: controllers.profile.getProfile,
  },
  {
    route: "/user/me",
    method: "patch",
    requireAuth: true,
    controller: controllers.profile.updateProfile,
  },
  {
    route: "/user/me",
    method: "delete",
    requireAuth: true,
    controller: controllers.profile.deleteAccount,
  },
  {
    route: "/user/me/deactivate",
    method: "patch",
    requireAuth: true,
    controller: controllers.profile.deactivateAccount,
  },
  {
    route: "/user/me/picture",
    method: "delete",
    requireAuth: true,
    controller: controllers.profile.deletePicture,
  },
  {
    route: "/posts/create",
    method: "post",
    requireAuth: true,
    controller: controllers.posts.createPost,
  },
  {
    route: "/posts/mine",
    method: "get",
    requireAuth: true,
    controller: controllers.posts.fetchMyPosts,
  },
  {
    route: "/posts",
    method: "get",
    requireAuth: true,
    controller: controllers.posts.fetchAllPosts,
  },
  {
    route: "/posts/:postId",
    method: "get",
    requireAuth: true,
    controller: controllers.posts.fetchPostById,
  },
  {
    route: "/posts/:postId",
    method: "patch",
    requireAuth: true,
    controller: controllers.posts.editPost,
  },
  {
    route: "/posts/:postId",
    method: "delete",
    requireAuth: true,
    controller: controllers.posts.deletePost,
  },
  {
    route: "/posts/like/:postId",
    method: "put",
    requireAuth: true,
    controller: controllers.posts.likeAPost,
  },
  {
    route: "/posts/tags",
    method: "get",
    requireAuth: true,
    controller: controllers.posts.searchPostsByTag,
  },
  {
    route: "/tags",
    method: "get",
    requireAuth: true,
    controller: controllers.tags.fetchAllTags,
  },
  {
    route: "/posts/comments/:postId",
    method: "post",
    requireAuth: true,
    controller: controllers.comments.addCommentToPost,
  },
  {
    route: "/posts/comments/:commentId",
    method: "put",
    requireAuth: true,
    controller: controllers.comments.editCommentById,
  },
  {
    route: "/posts/comments/:commentId",
    method: "delete",
    requireAuth: true,
    controller: controllers.comments.deleteCommentById,
  },
  {
    route: "/posts/comments/:postId",
    method: "get",
    requireAuth: true,
    controller: controllers.comments.fetchAllCommentsByPostId,
  },
  {
    route: "/media/upload",
    method: "post",
    requireAuth: true,
    requireUpload: true,
    controller: controllers.media.uploadMedia,
  },
];

routes.forEach(({ route, method, requireAuth, requireUpload, controller }) => {
  if (requireUpload && requireAuth) {
    router[method](route, auth, upload, controller);
  } else if (requireAuth) {
    router[method](route, auth, controller);
  } else {
    router[method](route, controller);
  }
});

export default router;
