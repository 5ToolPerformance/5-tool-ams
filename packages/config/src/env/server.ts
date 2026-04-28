import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isTestEnv = process.env.NODE_ENV === "test";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().url(),
    CRON_SECRET: z.string(),
    PORTAL_APP_URL: z.string().url(),
    PORTAL_EMAIL_API_KEY: isTestEnv
      ? z.string().default("test-resend-key")
      : z.string(),
    PORTAL_EMAIL_FROM: isTestEnv
      ? z.string().email().default("portal@example.com")
      : z.string().email(),
    ARMCARE_STATUS: z.string(),
    ARMCARE_USERNAME: z.string(),
    ARMCARE_PASSWORD: z.string(),
    ARMCARE_AUTH_URL_STAGING: z.string().url(),
    ARMCARE_API_URL_STAGING: z.string().url(),
    ARMCARE_AUTH_URL_PROD: z.string().url(),
    ARMCARE_API_URL_PROD: z.string().url(),
    AZURE_STORAGE_ACCOUNT_NAME: z.string(),
    AZURE_STORAGE_CONNECTION_STRING: z.string(),
    AZURE_STORAGE_CONTAINER_NAME: z.string(),
    PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
  },
  onValidationError: (error) => {
    console.error("Invalid environment variables:", error);
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
