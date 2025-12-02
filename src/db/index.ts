import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "@/db/schema";
import { env } from "@/env/server";

const db = drizzle(env.DATABASE_URL, { schema });

export default db;
