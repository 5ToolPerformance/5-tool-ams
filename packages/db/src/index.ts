import { neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "@/db/schema";
import { env } from "@ams/config/env/database";

neonConfig.poolQueryViaFetch = true;

const db = drizzle(env.DATABASE_URL, { schema });

export type DB = typeof db;

export default db;
