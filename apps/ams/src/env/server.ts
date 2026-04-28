import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

const appRootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const localEnvPath = path.resolve(appRootPath, ".env.local");
const defaultEnvPath = path.resolve(appRootPath, ".env");
const envPath = existsSync(localEnvPath) ? localEnvPath : defaultEnvPath;

expand(config({ path: envPath }));

const isTestEnv = process.env.NODE_ENV === "test";
const requiredString = (testDefault: string) =>
  isTestEnv ? z.string().default(testDefault) : z.string();
const requiredUrl = (testDefault: string) =>
  isTestEnv ? z.string().url().default(testDefault) : z.string().url();

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: requiredUrl("postgres://user:pass@localhost:5432/ams"),
    API_BASE_URL: requiredUrl("http://api.test"),
    API_INTERNAL_AUTH_SECRET: isTestEnv
      ? z.string().min(32).default("test-internal-api-secret-with-32-chars")
      : z.string().min(32),
    AUTH_SECRET: requiredString("test-auth-secret"),
    GOOGLE_CLIENT_ID: requiredString("test-google-client-id"),
    GOOGLE_CLIENT_SECRET: requiredString("test-google-client-secret"),
    AUTH_MICROSOFT_ENTRA_ID_ID: requiredString("test-microsoft-id"),
    AUTH_MICROSOFT_ENTRA_ID_SECRET: requiredString("test-microsoft-secret"),
    AUTH_MICROSOFT_ENTRA_ID_ISSUER: requiredUrl("https://login.microsoftonline.com/test/v2.0"),
    CRON_SECRET: requiredString("test-cron-secret"),
    PORTAL_APP_URL: requiredUrl("https://portal.example.com"),
    PORTAL_EMAIL_API_KEY: isTestEnv
      ? z.string().default("test-resend-key")
      : z.string(),
    PORTAL_EMAIL_FROM: isTestEnv
      ? z.string().email().default("portal@example.com")
      : z.string().email(),
    AZURE_STORAGE_ACCOUNT_NAME: requiredString("teststorage"),
    AZURE_STORAGE_CONNECTION_STRING: requiredString(
      "DefaultEndpointsProtocol=https;AccountName=teststorage;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net"
    ),
    AZURE_STORAGE_CONTAINER_NAME: requiredString("attachments"),
    PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
  },
  onValidationError: (error) => {
    console.error("Invalid AMS environment variables:", error);
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
