// db/schema/hawkinsIso.ts
import { numeric, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { baseHawkinsColumns } from "./shared";

export const hawkinsIso = pgTable(
  "hawkins_iso",
  {
    ...baseHawkinsColumns,
    lengthOfPullS: numeric("length_of_pull_s"),
    timeToPeakForceS: numeric("time_to_peak_force_s"),
    peakForceN: numeric("peak_force_n"),
  },
  (t) => [
    uniqueIndex("hawkins_iso_unique_attempt").on(
      t.athleteId,
      t.timestamp,
      t.attemptKey
    ),
  ]
);
