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
const isTestEnv = process.env.NODE_ENV === "test";

expand(config({ path: envPath }));

const requiredString = (testDefault: string) =>
  isTestEnv ? z.string().default(testDefault) : z.string();
const requiredUrl = (testDefault: string) =>
  isTestEnv ? z.string().url().default(testDefault) : z.string().url();

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    AUTH_SECRET: requiredString("test-auth-secret"),
    AUTH_RESEND_KEY: isTestEnv
      ? z.string().default("test-resend-key")
      : z.string(),
    AUTH_RESEND_FROM: isTestEnv
      ? z.string().email().default("portal@example.com")
      : z.string().email(),
    DATABASE_URL: requiredUrl("postgres://user:pass@localhost:5432/ams"),
    API_BASE_URL: requiredUrl("http://api.test"),
    API_INTERNAL_AUTH_SECRET: isTestEnv
      ? z.string().min(32).default("test-internal-api-secret-with-32-chars")
      : z.string().min(32),
    PORTAL_APP_URL: requiredUrl("https://portal.example.com"),
    PORTAL_EMAIL_API_KEY: isTestEnv
      ? z.string().default("test-resend-key")
      : z.string(),
    PORTAL_EMAIL_FROM: isTestEnv
      ? z.string().email().default("portal@example.com")
      : z.string().email(),
    ARMCARE_STATUS: requiredString("staging"),
    ARMCARE_USERNAME: requiredString("test-armcare-user"),
    ARMCARE_PASSWORD: requiredString("test-armcare-password"),
    ARMCARE_AUTH_URL_STAGING: requiredUrl("https://armcare-staging.example.com/auth"),
    ARMCARE_API_URL_STAGING: requiredUrl("https://armcare-staging.example.com/api"),
    ARMCARE_AUTH_URL_PROD: requiredUrl("https://armcare.example.com/auth"),
    ARMCARE_API_URL_PROD: requiredUrl("https://armcare.example.com/api"),
    AZURE_STORAGE_ACCOUNT_NAME: requiredString("teststorage"),
    AZURE_STORAGE_CONNECTION_STRING: requiredString(
      "DefaultEndpointsProtocol=https;AccountName=teststorage;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net"
    ),
    AZURE_STORAGE_CONTAINER_NAME: requiredString("attachments"),
    PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
  },
  onValidationError: (error) => {
    console.error("Invalid portal environment variables:", error);
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
