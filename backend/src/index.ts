import express from "express";
import dataSource from "./dataSource";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {
  authRoutes,
  poiRoutes,
  profileRoutes,
  citiesRoutes,
  categoriesRoutes,
  messageRoutes,
} from "./routes";
import helmet from "helmet";

dotenv.config();

export const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use((req, res, next) => {
  const corsWhitelist = [process.env.FRONTEND_URL, process.env.DEPLOY_URL];

  if (
    req.headers.origin !== undefined &&
    corsWhitelist.includes(req.headers.origin)
  ) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/public", express.static(path.resolve(__dirname, "..", "public")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/poi", poiRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/contact", messageRoutes);

const start = async (): Promise<void> => {
  const port = process.env.BACK_PORT as string;

  await dataSource.initialize();

  app.listen({ port }, () => {
    console.log(`Backend app ready at http://localhost:${port}`);
  });
};
void start();
