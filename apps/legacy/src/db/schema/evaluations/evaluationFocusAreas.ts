import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { evaluations } from "@/db/schema/evaluations/evaluations";

export const evaluationFocusAreas = pgTable(
  "evaluation_focus_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),

    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    index("evaluation_focus_areas_evaluation_idx").on(t.evaluationId),
    check("evaluation_focus_areas_sort_order_check", sql`${t.sortOrder} >= 0`),
  ]
);
