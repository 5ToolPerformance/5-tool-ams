// db/schema/athleteCohorts.ts
import {
    pgTable,
    uuid,
} from "drizzle-orm/pg-core";
import playerInformation from "../players/playerInformation";
import { cohortDefinitions } from "./cohortDefinitions";

export const athleteCohorts = pgTable("athlete_cohorts", {
  athleteId: uuid("athlete_id")
    .references(() => playerInformation.id, { onDelete: "cascade" })
    .notNull(),

  cohortId: uuid("cohort_id")
    .references(() => cohortDefinitions.id, { onDelete: "cascade" })
    .notNull(),
});
