import { numeric, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { baseHawkinsColumns } from "./shared";

export const hawkinsTsIso = pgTable(
  "hawkins_ts_iso",
  {
    ...baseHawkinsColumns,
    peakForceN: numeric("peak_force_n"),
  },
  (t) => [
    uniqueIndex("hawkins_ts_iso_unique_attempt").on(
      t.athleteId,
      t.timestamp,
      t.attemptKey
    ),
  ]
);
