import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "@/db/schema";
import { env } from "../../config/src/env/server";

const db = drizzle(env.DATABASE_URL, { schema });

export type DB = typeof db;

export default db;
