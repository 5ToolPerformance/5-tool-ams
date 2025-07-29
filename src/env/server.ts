import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config({ path: "./.env.local" }));

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    AUTH_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_ID: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_SECRET: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_ISSUER: z.string(),
    DATABASE_URL: z.string().url(),
  },
  onValidationError: (error) => {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,
});
