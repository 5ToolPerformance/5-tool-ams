import { z } from "zod";

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const parsedDatabaseEnv = databaseEnvSchema.safeParse(process.env);

if (!parsedDatabaseEnv.success) {
  console.error("Invalid database environment variables:", parsedDatabaseEnv.error);
  process.exit(1);
}

export const env = parsedDatabaseEnv.data;
