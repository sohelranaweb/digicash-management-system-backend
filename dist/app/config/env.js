"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
// Load .env from project root folder safely
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
// Define Zod schema for environment variables
const envSchema = zod_1.default.object({
    PORT: zod_1.default.string(),
    DB_URL: zod_1.default.string(),
    NODE_ENV: zod_1.default.enum(["development", "production"]),
    BCRYPT_SALT_ROUND: zod_1.default.string(),
    JWT_ACCESS_SECRET: zod_1.default.string(),
    JWT_ACCESS_EXPIRES: zod_1.default.string(),
    JWT_REFRESH_SECRET: zod_1.default.string(),
    JWT_REFRESH_EXPIRES: zod_1.default.string(),
    ADMIN_EMAIL: zod_1.default.string(),
    ADMIN_PASSWORD: zod_1.default.string(),
    GOOGLE_CLIENT_ID: zod_1.default.string(),
    GOOGLE_CLIENT_SECRET: zod_1.default.string(),
    GOOGLE_CALLBACK_URL: zod_1.default.string(),
    EXPRESS_SESSION_SECRET: zod_1.default.string(),
    FRONTEND_URL: zod_1.default.string(),
    REDIS_HOST: zod_1.default.string(),
    REDIS_PORT: zod_1.default.string(),
    REDIS_USERNAME: zod_1.default.string(),
    REDIS_PASSWORD: zod_1.default.string(),
    SMTP_PASS: zod_1.default.string(),
    SMTP_PORT: zod_1.default.string(),
    SMTP_HOST: zod_1.default.string(),
    SMTP_FROM: zod_1.default.string(),
    SMTP_USER: zod_1.default.string(),
    BASE_FEE_RATE: zod_1.default.string(),
    AGENT_COMMISSION_RATE: zod_1.default.string(),
    TRANSFER_FEE: zod_1.default.string(),
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
exports.envVars = parsedEnv.data;
