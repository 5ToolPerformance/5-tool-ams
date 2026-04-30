import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const parsedServerEnv = serverEnvSchema.safeParse(process.env);

if (!parsedServerEnv.success) {
  console.error("Invalid server environment variables:", parsedServerEnv.error);
  process.exit(1);
}

export const env = parsedServerEnv.data;
