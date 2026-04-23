import { and, eq, gte, lte, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import { lesson, playerInformation, users } from "@/db/schema";

interface DashboardCoachWhereInput {
  facilityId: string;
  startIso: string | null;
  endIso: string;
}

export interface DashboardCoachMetricRowQuery {
  coachId: string;
  coachName: string | null;
  lessonsLogged: number;
  uniquePlayers: number;
  avgLogDelayDays: number;
}

function buildWhere({ facilityId, startIso, endIso }: DashboardCoachWhereInput) {
  const clauses = [eq(playerInformation.facilityId, facilityId), lte(lesson.lessonDate, endIso)];
  if (startIso) {
    clauses.push(gte(lesson.lessonDate, startIso));
  }
  return and(...clauses);
}

export async function getDashboardCoachMetrics(
  input: DashboardCoachWhereInput,
  conn: DB = db
): Promise<DashboardCoachMetricRowQuery[]> {
  const whereClause = buildWhere(input);

  return conn
    .select({
      coachId: lesson.coachId,
      coachName: users.name,
      lessonsLogged: sql<number>`count(${lesson.id})::int`,
      uniquePlayers: sql<number>`count(distinct ${lesson.playerId})::int`,
      avgLogDelayDays:
        sql<number>`coalesce(avg(extract(epoch from (${lesson.createdOn} - ${lesson.lessonDate})) / 86400), 0)::numeric(10,2)`.mapWith(
          Number
        ),
    })
    .from(lesson)
    .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
    .innerJoin(users, eq(lesson.coachId, users.id))
    .where(whereClause)
    .groupBy(lesson.coachId, users.name)
    .orderBy(sql`count(${lesson.id}) desc`);
}

