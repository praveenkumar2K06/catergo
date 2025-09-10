import "dotenv/config";
import cors from "cors";
import express from "express";
import { env } from "@/config/env";
import { appRouter } from "@/routers";

const app = express();

app.use(
	cors({
		origin: [env.ADMIN_URL || "", env.FRONTEND_URL || ""],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	}),
);

app.use(express.json());

app.use("/api", appRouter);

app.listen(env.PORT, () => {
	console.log(
		`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`,
	);
});
