import "dotenv/config";
import cors from "cors";
import express from "express";
import { appRouter } from "@/routers";

const app = express();

app.use(
	cors({
		origin: [process.env.ADMIN_URL || "", process.env.FRONTEND_URL || ""],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	}),
);

app.use(express.json());

app.use("/api", appRouter);

app.get("/", (_req, res) => {
	res.status(200).send({ message: "Application Running" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
