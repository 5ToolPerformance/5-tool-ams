import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "@/env/server";

const db = drizzle(env.DATABASE_URL);

export default db;
