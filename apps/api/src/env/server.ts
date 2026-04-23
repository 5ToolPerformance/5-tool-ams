import { existsSync } from "node:fs";
import path from "node:path";

import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

const workspaceEnvPath = path.resolve(process.cwd(), "../../.env.local");
const localEnvPath = path.resolve(process.cwd(), ".env.local");

expand(
  config({
    path: existsSync(workspaceEnvPath) ? workspaceEnvPath : localEnvPath,
  })
);

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    CRON_SECRET: z.string(),
  },
  onValidationError: (error) => {
    console.error("Invalid API environment variables:", error);
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,
});
