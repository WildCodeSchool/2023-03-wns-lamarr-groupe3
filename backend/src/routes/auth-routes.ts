import express from "express";
import { AuthController } from "../controllers/user-controller";
// import { limiter } from "../middlewares/limiter";
import { auth } from "../middlewares/auth";

export const authRoutes = express.Router();

authRoutes.post(
  "/login",
  // limiter,
  AuthController.login
);

authRoutes.post(
  "/register",
  //  limiter,
  AuthController.register
);

authRoutes.get("/logout", AuthController.logout);

authRoutes.put("/newpassword/:id", auth, AuthController.updatePassword);
