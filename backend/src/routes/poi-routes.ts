import express from "express";
import multer from "multer";
import { PoiController } from "../controllers/poiController";
import { auth } from "../middlewares/auth";
export const poiRoutes = express.Router();
const upload = multer({ dest: "./public/categories" });

poiRoutes.get("/", PoiController.getPoi);

poiRoutes.get("/:id", PoiController.getOnePoi);

poiRoutes.post(
  "/",
  // auth,
  upload.single("image"),
  PoiController.createPoi
);

poiRoutes.put("/:id", auth, PoiController.updatePoi);

poiRoutes.delete("/:id", auth, PoiController.deletePoi);
