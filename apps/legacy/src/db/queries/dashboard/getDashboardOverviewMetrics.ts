import { and, eq, gte, lte, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import { lesson, playerInformation } from "@/db/schema";
import { DashboardLessonType } from "@/domain/dashboard/types";

interface DashboardOverviewWhereInput {
  facilityId: string;
  startIso: string | null;
  endIso: string;
}

export interface DashboardOverviewMetricsResult {
  totalLessons: number;
  activeCoaches: number;
  activePlayers: number;
  lessonsByType: Array<{
    lessonType: DashboardLessonType;
    count: number;
  }>;
  dailyLessons: Array<{
    date: string;
    lessons: number;
  }>;
}

function buildWhere({ facilityId, startIso, endIso }: DashboardOverviewWhereInput) {
  const clauses = [eq(playerInformation.facilityId, facilityId), lte(lesson.lessonDate, endIso)];
  if (startIso) {
    clauses.push(gte(lesson.lessonDate, startIso));
  }

  return and(...clauses);
}

export async function getDashboardOverviewMetrics(
  input: DashboardOverviewWhereInput,
  conn: DB = db
): Promise<DashboardOverviewMetricsResult> {
  const whereClause = buildWhere(input);

  const [totalsRow, lessonsByTypeRows, dailyRows] = await Promise.all([
    conn
      .select({
        totalLessons: sql<number>`count(${lesson.id})::int`,
        activeCoaches: sql<number>`count(distinct ${lesson.coachId})::int`,
        activePlayers: sql<number>`count(distinct ${lesson.playerId})::int`,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(whereClause)
      .then((rows) => rows[0]),
    conn
      .select({
        lessonType: lesson.lessonType,
        count: sql<number>`count(${lesson.id})::int`,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(whereClause)
      .groupBy(lesson.lessonType)
      .orderBy(lesson.lessonType),
    conn
      .select({
        date: sql<string>`to_char(date_trunc('day', ${lesson.lessonDate}), 'YYYY-MM-DD')`,
        lessons: sql<number>`count(${lesson.id})::int`,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(whereClause)
      .groupBy(sql`date_trunc('day', ${lesson.lessonDate})`)
      .orderBy(sql`date_trunc('day', ${lesson.lessonDate})`),
  ]);

  return {
    totalLessons: totalsRow?.totalLessons ?? 0,
    activeCoaches: totalsRow?.activeCoaches ?? 0,
    activePlayers: totalsRow?.activePlayers ?? 0,
    lessonsByType: lessonsByTypeRows.map((row) => ({
      lessonType: row.lessonType as DashboardLessonType,
      count: row.count,
    })),
    dailyLessons: dailyRows,
  };
}

