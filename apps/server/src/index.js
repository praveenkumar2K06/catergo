import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./client.js";
import { env } from "./config/env.js";
import { appRouter } from "./routers/index.js";

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

const bootstrap = async () => {
    try {
        await connectDB();
        app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

bootstrap();
