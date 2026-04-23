// db/schema/hawkinsCmj.ts
import { numeric, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { baseHawkinsColumns } from "./shared";

export const hawkinsCmj = pgTable(
  "hawkins_cmj",
  {
    ...baseHawkinsColumns,
    jumpHeightM: numeric("jump_height_m"),
    peakPropulsivePowerW: numeric("peak_propulsive_power_w"),
    avgPropulsiveVelocityMS: numeric("avg_propulsive_velocity_m_s"),
    propulsiveImpulseNS: numeric("propulsive_impulse_n_s"),
    p1PropulsiveImpulseNS: numeric("p1_propulsive_impulse_n_s"),
    p2PropulsiveImpulseNS: numeric("p2_propulsive_impulse_n_s"),
    p1p2PropulsiveImpulseIndex: numeric("p1p2_propulsive_impulse_index"),
  },
  (t) => [
    uniqueIndex("hawkins_cmj_unique_attempt").on(
      t.athleteId,
      t.timestamp,
      t.attemptKey
    ),
  ]
);
