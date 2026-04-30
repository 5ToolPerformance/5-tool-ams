import { z } from "zod";

const isTestEnv = process.env.NODE_ENV === "test";

const portalEmailEnvSchema = z.object({
  PORTAL_APP_URL: isTestEnv
    ? z.string().url().default("https://portal.example.com")
    : z.string().url(),
  PORTAL_EMAIL_API_KEY: isTestEnv
    ? z.string().default("test-resend-key")
    : z.string(),
  PORTAL_EMAIL_FROM: isTestEnv
    ? z.string().email().default("portal@example.com")
    : z.string().email(),
});

const parsedPortalEmailEnv = portalEmailEnvSchema.safeParse(process.env);

if (!parsedPortalEmailEnv.success) {
  console.error(
    "Invalid portal email environment variables:",
    parsedPortalEmailEnv.error
  );
  process.exit(1);
}

export const env = parsedPortalEmailEnv.data;
