import { Router } from "express";

import { MediaController } from "../controllers";

import auth from "../middleware/auth.middleware";

const router = Router();

const mediaController = new MediaController();

const mediaRoute = () => {
  router.post("/media/upload", auth, mediaController.uploadMedia);

  return router;
};

export default mediaRoute;
