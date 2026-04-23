import { desc, eq } from "drizzle-orm";

import db, { DB } from "@/db";
import { weeklyUsageReports } from "@/db/schema";
import type { WeeklyUsageReportDocument } from "@ams/domain/admin/weeklyUsageReport/types";

export interface DashboardWeeklyUsageReportRecord {
  id: string;
  facilityId: string | null;
  weekStart: string | null;
  weekEnd: string | null;
  status: "pending" | "complete" | "failed";
  reportVersion: number;
  reportData: WeeklyUsageReportDocument;
  generatedAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
}

function normalizeTimestamp(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export async function getDashboardWeeklyReports(
  facilityId: string,
  conn: DB = db
): Promise<DashboardWeeklyUsageReportRecord[]> {
  const rows = await conn
    .select({
      id: weeklyUsageReports.id,
      facilityId: weeklyUsageReports.facilityId,
      weekStart: weeklyUsageReports.weekStart,
      weekEnd: weeklyUsageReports.weekEnd,
      status: weeklyUsageReports.status,
      reportVersion: weeklyUsageReports.reportVersion,
      reportData: weeklyUsageReports.reportData,
      generatedAt: weeklyUsageReports.generatedAt,
      failedAt: weeklyUsageReports.failedAt,
      errorMessage: weeklyUsageReports.errorMessage,
    })
    .from(weeklyUsageReports)
    .where(eq(weeklyUsageReports.facilityId, facilityId))
    .orderBy(desc(weeklyUsageReports.weekStart), desc(weeklyUsageReports.createdOn));

  return rows.map((row) => ({
    id: row.id,
    facilityId: row.facilityId,
    weekStart: normalizeTimestamp(row.weekStart),
    weekEnd: normalizeTimestamp(row.weekEnd),
    status: row.status,
    reportVersion: row.reportVersion,
    reportData: row.reportData,
    generatedAt: normalizeTimestamp(row.generatedAt),
    failedAt: normalizeTimestamp(row.failedAt),
    errorMessage: row.errorMessage,
  }));
}

export async function getWeeklyUsageReportById(
  reportId: string,
  conn: DB = db
): Promise<DashboardWeeklyUsageReportRecord | null> {
  const [row] = await conn
    .select({
      id: weeklyUsageReports.id,
      facilityId: weeklyUsageReports.facilityId,
      weekStart: weeklyUsageReports.weekStart,
      weekEnd: weeklyUsageReports.weekEnd,
      status: weeklyUsageReports.status,
      reportVersion: weeklyUsageReports.reportVersion,
      reportData: weeklyUsageReports.reportData,
      generatedAt: weeklyUsageReports.generatedAt,
      failedAt: weeklyUsageReports.failedAt,
      errorMessage: weeklyUsageReports.errorMessage,
    })
    .from(weeklyUsageReports)
    .where(eq(weeklyUsageReports.id, reportId))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    facilityId: row.facilityId,
    weekStart: normalizeTimestamp(row.weekStart),
    weekEnd: normalizeTimestamp(row.weekEnd),
    status: row.status,
    reportVersion: row.reportVersion,
    reportData: row.reportData,
    generatedAt: normalizeTimestamp(row.generatedAt),
    failedAt: normalizeTimestamp(row.failedAt),
    errorMessage: row.errorMessage,
  };
}
