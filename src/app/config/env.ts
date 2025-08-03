import dotenv from "dotenv";
import path from "path";
import z from "zod";

// Load .env from project root folder safely
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Define Zod schema for environment variables
const envSchema = z.object({
  PORT: z.string(),
  DB_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
  BCRYPT_SALT_ROUND: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  EXPRESS_SESSION_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  SMTP_PASS: z.string(),
  SMTP_PORT: z.string(),
  SMTP_HOST: z.string(),
  SMTP_FROM: z.string(),
  SMTP_USER: z.string(),
  BASE_FEE_RATE: z.string(),
  AGENT_COMMISSION_RATE: z.string(),
  TRANSFER_FEE: z.string(),
});

// Validate process.env at runtime using zod
const parsedEnv = envSchema.safeParse(process.env);

// If validation fails, print error and exit.
if (!parsedEnv.success) {
  console.log("Invalid environment variables");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

// Export validated env variables for use throughout app
export const envVars = parsedEnv.data;

// Export the TypeScript type infered from Zod schema
export type EnvVarsType = z.infer<typeof envSchema>;
