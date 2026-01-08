import { numeric, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { baseHawkinsColumns } from "./shared";

export const hawkinsDropJump = pgTable(
  "hawkins_drop_jump",
  {
    ...baseHawkinsColumns,
    mrsi: numeric("mrsi"),
  },
  (t) => [
    uniqueIndex("hawkins_drop_jump_unique_attempt").on(
      t.athleteId,
      t.timestamp,
      t.externalUniqueId
    ),
  ]
);
