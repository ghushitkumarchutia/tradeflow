import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"]),
  CORS_ORIGIN: z.string().url(),
});

export const env = envSchema.parse(process.env);
