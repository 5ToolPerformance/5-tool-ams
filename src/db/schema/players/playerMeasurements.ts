import { pgTable, real, timestamp, uuid } from "drizzle-orm/pg-core";

import playerInformation from "./playerInformation";

export const playerMeasurements = pgTable("player_measurements", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id")
    .references(() => playerInformation.id, { onDelete: "cascade" })
    .notNull(),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  recordedOn: timestamp("recorded_on", { mode: "string" })
    .defaultNow()
    .notNull(),
});

export default playerMeasurements;
