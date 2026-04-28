import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config({ path: "./.env.local" }));

const isTestEnv = process.env.NODE_ENV === "test";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    AUTH_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_ID: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_SECRET: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_ISSUER: z.string(),
    AUTH_RESEND_KEY: isTestEnv ? z.string().default("test-resend-key") : z.string(),
    AUTH_RESEND_FROM: isTestEnv
      ? z.string().email().default("portal@example.com")
      : z.string().email(),
    DATABASE_URL: z.string().url(),
    //Cron
    CRON_SECRET: z.string(),
    //Armcare
    ARMCARE_STATUS: z.string(),
    ARMCARE_USERNAME: z.string(),
    ARMCARE_PASSWORD: z.string(),
    ARMCARE_AUTH_URL_STAGING: z.string().url(),
    ARMCARE_API_URL_STAGING: z.string().url(),
    ARMCARE_AUTH_URL_PROD: z.string().url(),
    ARMCARE_API_URL_PROD: z.string().url(),
    //Azure Storage
    AZURE_STORAGE_ACCOUNT_NAME: z.string(),
    AZURE_STORAGE_CONNECTION_STRING: z.string(),
    AZURE_STORAGE_CONTAINER_NAME: z.string(),
    PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
  },
  onValidationError: (error) => {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
