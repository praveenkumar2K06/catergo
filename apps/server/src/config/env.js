import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRY: z.string().default("7d"),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    ADMIN_URL: z.string().url("ADMIN_URL must be a valid URL").optional(),
    FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL").optional(),
});

export const env = envSchema.parse(process.env);
