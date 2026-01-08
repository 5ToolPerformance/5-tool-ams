import { numeric, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { baseHawkinsColumns } from "./shared";

export const hawkinsMulti = pgTable(
  "hawkins_multi",
  {
    ...baseHawkinsColumns,
    avgMrsi: numeric("avg_mrsi"),
  },
  (t) => [
    uniqueIndex("hawkins_multi_unique_attempt").on(
      t.athleteId,
      t.timestamp,
      t.attemptKey
    ),
  ]
);
