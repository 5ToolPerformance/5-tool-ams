import { z } from "zod";

const isTestEnv = process.env.NODE_ENV === "test";
const requiredString = (testDefault: string) =>
  isTestEnv ? z.string().default(testDefault) : z.string();
const requiredUrl = (testDefault: string) =>
  isTestEnv ? z.string().url().default(testDefault) : z.string().url();

const armcareEnvSchema = z.object({
  ARMCARE_STATUS: requiredString("staging"),
  ARMCARE_USERNAME: requiredString("test-armcare-user"),
  ARMCARE_PASSWORD: requiredString("test-armcare-password"),
  ARMCARE_AUTH_URL_STAGING: requiredUrl("https://armcare-staging.example.com/auth"),
  ARMCARE_API_URL_STAGING: requiredUrl("https://armcare-staging.example.com/api"),
  ARMCARE_AUTH_URL_PROD: requiredUrl("https://armcare.example.com/auth"),
  ARMCARE_API_URL_PROD: requiredUrl("https://armcare.example.com/api"),
});

const parsedArmcareEnv = armcareEnvSchema.safeParse(process.env);

if (!parsedArmcareEnv.success) {
  console.error("Invalid ArmCare environment variables:", parsedArmcareEnv.error);
  process.exit(1);
}

export const env = parsedArmcareEnv.data;
