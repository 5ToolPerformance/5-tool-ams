import { existsSync } from "node:fs";
import path from "node:path";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

const workspaceEnvPath = path.resolve(process.cwd(), "../../.env.local");
const localEnvPath = path.resolve(process.cwd(), ".env.local");
const envPath = existsSync(workspaceEnvPath) ? workspaceEnvPath : localEnvPath;

expand(config({ path: envPath }));

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const parsedDatabaseEnv = databaseEnvSchema.safeParse(process.env);

if (!parsedDatabaseEnv.success) {
  console.error("Invalid database environment variables:", parsedDatabaseEnv.error);
  process.exit(1);
}

export const env = parsedDatabaseEnv.data;
