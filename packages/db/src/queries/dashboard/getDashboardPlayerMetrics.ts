import { and, eq, gte, lte, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import { lesson, playerInformation } from "@/db/schema";

interface DashboardPlayerWhereInput {
  facilityId: string;
  startIso: string | null;
  endIso: string;
}

export interface DashboardPlayerMetricRowQuery {
  playerId: string;
  firstName: string;
  lastName: string;
  lessons: number;
  uniqueCoaches: number;
  latestLessonDate: string | null;
}

function buildWhere({ facilityId, startIso, endIso }: DashboardPlayerWhereInput) {
  const clauses = [eq(playerInformation.facilityId, facilityId), lte(lesson.lessonDate, endIso)];
  if (startIso) {
    clauses.push(gte(lesson.lessonDate, startIso));
  }
  return and(...clauses);
}

export async function getDashboardPlayerMetrics(
  input: DashboardPlayerWhereInput,
  conn: DB = db
): Promise<DashboardPlayerMetricRowQuery[]> {
  const whereClause = buildWhere(input);

  return conn
    .select({
      playerId: playerInformation.id,
      firstName: playerInformation.firstName,
      lastName: playerInformation.lastName,
      lessons: sql<number>`count(${lesson.id})::int`,
      uniqueCoaches: sql<number>`count(distinct ${lesson.coachId})::int`,
      latestLessonDate: sql<string | null>`max(${lesson.lessonDate})`,
    })
    .from(lesson)
    .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
    .where(whereClause)
    .groupBy(playerInformation.id, playerInformation.firstName, playerInformation.lastName)
    .orderBy(sql`count(${lesson.id}) desc`);
}

