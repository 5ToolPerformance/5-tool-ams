import { defineConfig } from "drizzle-kit";

import { env } from "@ams/config/env/database";

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  out: "./src/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
