import dotenv from "dotenv";
import { z } from "zod";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"]),
  CORS_ORIGIN: z.string().url(),
});

export const env = envSchema.parse(process.env);
