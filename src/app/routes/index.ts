import { Router } from "express";

import postsRoute from "./posts.route";
import usersRoute from "./users.route";
import commentsRoute from "./comments.route";
import mediaRoute from "./media.route";

const router = Router();

const rootRouter = () => {
  router.use(usersRoute());
  router.use(postsRoute);
  router.use(commentsRoute);
  router.use(mediaRoute);

  return router;
};

export default rootRouter;
