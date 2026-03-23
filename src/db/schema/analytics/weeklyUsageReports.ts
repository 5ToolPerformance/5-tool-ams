import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { facilities, users } from "@/db/schema";
import { WeeklyUsageReportDocument } from "@/domain/admin/weeklyUsageReport/types";

export const weeklyUsageReportStatusEnum = pgEnum(
  "weekly_usage_report_status",
  ["pending", "complete", "failed"]
);

export const weeklyUsageReports = pgTable(
  "weekly_usage_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    facilityId: uuid("facility_id").references(() => facilities.id, {
      onDelete: "cascade",
    }),

    weekStart: timestamp("week_start", { withTimezone: true }).notNull(),
    weekEnd: timestamp("week_end", { withTimezone: true }).notNull(),

    status: weeklyUsageReportStatusEnum("status").default("pending").notNull(),

    reportVersion: integer("report_version").default(1).notNull(),

    reportData: jsonb("report_data")
      .$type<WeeklyUsageReportDocument>()
      .notNull(),

    generatedAt: timestamp("generated_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    errorMessage: text("error_message"),

    generatedByUserId: uuid("generated_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("weekly_usage_reports_facility_week_unique").on(
      table.facilityId,
      table.weekStart,
      table.weekEnd
    ),
    index("weekly_usage_reports_facility_week_start_idx").on(
      table.facilityId,
      table.weekStart
    ),
    index("weekly_usage_reports_status_idx").on(table.status),
  ]
);
