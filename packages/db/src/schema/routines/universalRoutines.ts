import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { disciplines } from "@/db/schema/config/disciplines";
import { routineTypeEnum } from "@/db/schema/development-plans/developmentPlanRoutines";
import { facilities } from "@/db/schema/facilities";
import users from "@/db/schema/users";

export const universalRoutines = pgTable(
  "universal_routines",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),

    title: text("title").notNull(),
    description: text("description"),
    routineType: routineTypeEnum("routine_type").notNull(),
    disciplineId: uuid("discipline_id")
      .notNull()
      .references(() => disciplines.id, { onDelete: "no action" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    documentData: jsonb("document_data"),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on").defaultNow().notNull(),
  },
  (t) => [
    index("universal_routines_facility_idx").on(t.facilityId),
    index("universal_routines_discipline_idx").on(t.disciplineId),
    index("universal_routines_type_idx").on(t.routineType),
    index("universal_routines_active_idx").on(t.isActive),
  ]
);

