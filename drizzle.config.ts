import { defineConfig } from "drizzle-kit";

import { env } from "./apps/legacy/src/env/server";

export default defineConfig({
  schema: "./apps/legacy/src/db/schema/index.ts",
  dialect: "postgresql",
  out: "./apps/legacy/src/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
