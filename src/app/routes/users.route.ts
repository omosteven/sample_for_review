import { Router } from "express";

import { AuthController, ProfileController } from "../controllers";

import auth from "../middleware/auth.middleware";

const router = Router();

const authController = new AuthController();
const profileController = new ProfileController();

const usersRoute = ()=> {
  router.post("/auth/login", authController.login);
  router.post("/auth/register", authController.register);
  router.put("/auth/change-password", auth);

  router.get("/user/me", auth, profileController.getProfile);
  router.patch("/user/me", auth, profileController.updateProfile);
  router.delete("/user/me", auth, profileController.deleteAccount);
  router.patch("/user/me/deactivate",auth,profileController.deactivateAccount);
  router.delete("/user/me/picture", auth, profileController.deletePicture);

  return router;
};

export default usersRoute;
