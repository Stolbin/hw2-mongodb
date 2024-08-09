import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
import {
  authErrorHendler,
  loginErrorHendler,
  userNotFoundHendler,
} from "../middlewares/authErrorHendler.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
  authErrorHendler
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
  userNotFoundHendler,
  loginErrorHendler
);

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

export default router;
