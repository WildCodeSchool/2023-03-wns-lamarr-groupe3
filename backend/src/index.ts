import express from "express";
import cors from "cors";
import dataSource from "./dataSource";
const path = require("path");
import cookieParser from "cookie-parser";
import {
	authRoutes,
	poiRoutes,
	profileRoutes,
	citiesRoutes,
	categoriesRoutes,
} from "./routes";
import { City } from "./entities/City";
import { User } from "./entities/User";
import { seed } from "./seed";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/public", express.static(path.join(__dirname + "/../public")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/poi", poiRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/categories", categoriesRoutes);

const start = async (): Promise<void> => {
	const port = 5000;

	await dataSource.initialize();

	if (process.env.NODE_ENV !== "production") {
		try {
			await seed();
		} catch (error) {
			console.log("Seed error: " + error);
		}
	}

	app.listen({ port }, () => {
		console.log(`Backend app ready at http://localhost:${port}`);
	});
};
void start();
