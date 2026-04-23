import { and, eq, gte, lt, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import {
  facilities,
  injury,
  lesson,
  playerInformation,
  users,
  weeklyUsageReports,
} from "@/db/schema";
import { getWeeklyUsageReportRange } from "@/domain/admin/weeklyUsageReport/range";
import {
  LessonTypeKey,
  WeeklyUsageReportDocument,
} from "@/domain/admin/weeklyUsageReport/types";

const REPORT_VERSION = 1;

type FacilitySummary = {
  id: string;
  name: string;
};

type WeeklyUsageReportStatus = "pending" | "complete" | "failed";

type CoachRow = {
  coachId: string;
  coachName: string | null;
  lessonsLogged: number;
  playersWorkedWith: number;
};

type CoachLessonTypeRow = {
  coachId: string;
  lessonType: string;
  lessonTypeCount: number;
};

type CoachSnapshot = WeeklyUsageReportDocument["coaches"]["items"][number];

function createLessonTypeCounts(): Record<LessonTypeKey, number> {
  return {
    hitting: 0,
    pitching: 0,
    fielding: 0,
    catching: 0,
    strength: 0,
    recovery: 0,
    other: 0,
  };
}

function mapLessonTypeKey(value: string): LessonTypeKey {
  switch (value) {
    case "hitting":
    case "pitching":
    case "fielding":
    case "catching":
    case "strength":
    case "recovery":
      return value;
    default:
      return "other";
  }
}

function createBaseDocument(
  facility: FacilitySummary,
  range: ReturnType<typeof getWeeklyUsageReportRange>
): WeeklyUsageReportDocument {
  return {
    version: 1,
    scope: {
      facilityId: facility.id,
      facilityName: facility.name,
    },
    range: {
      weekStart: range.weekStart.toISOString(),
      weekEnd: range.weekEnd.toISOString(),
      label: range.label,
      timezone: range.timezone,
    },
    summary: {
      activePlayers: 0,
      activeCoaches: 0,
      lessonsCreated: 0,
      newPlayersAdded: 0,
      injuriesLogged: 0,
    },
    coaches: {
      totalCoachesIncluded: 0,
      items: [],
    },
    notes: {
      generatedFrom: ["lesson", "player_information", "injury"],
    },
  };
}

async function upsertReportStatus(
  conn: DB,
  input: {
    facility: FacilitySummary;
    weekStart: Date;
    weekEnd: Date;
    reportData: WeeklyUsageReportDocument;
    status: WeeklyUsageReportStatus;
    generatedAt?: Date | null;
    failedAt?: Date | null;
    errorMessage?: string | null;
    generatedByUserId?: string | null;
  }
) {
  await conn
    .insert(weeklyUsageReports)
    .values({
      facilityId: input.facility.id,
      weekStart: input.weekStart,
      weekEnd: input.weekEnd,
      status: input.status,
      reportVersion: REPORT_VERSION,
      reportData: input.reportData,
      generatedAt: input.generatedAt ?? null,
      failedAt: input.failedAt ?? null,
      errorMessage: input.errorMessage ?? null,
      generatedByUserId: input.generatedByUserId ?? null,
      updatedOn: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        weeklyUsageReports.facilityId,
        weeklyUsageReports.weekStart,
        weeklyUsageReports.weekEnd,
      ],
      set: {
        status: input.status,
        reportVersion: REPORT_VERSION,
        reportData: input.reportData,
        generatedAt: input.generatedAt ?? null,
        failedAt: input.failedAt ?? null,
        errorMessage: input.errorMessage ?? null,
        generatedByUserId: input.generatedByUserId ?? null,
        updatedOn: new Date(),
      },
    });
}

async function generateWeeklyUsageReportForFacilityRecord(
  facility: FacilitySummary,
  range: ReturnType<typeof getWeeklyUsageReportRange>,
  options: {
    generatedByUserId?: string | null;
    conn?: DB;
  } = {}
) {
  const conn = options.conn ?? db;
  const pendingDocument = createBaseDocument(facility, range);

  await upsertReportStatus(conn, {
    facility,
    weekStart: range.weekStart,
    weekEnd: range.weekEnd,
    reportData: pendingDocument,
    status: "pending",
    generatedAt: null,
    failedAt: null,
    errorMessage: null,
    generatedByUserId: options.generatedByUserId ?? null,
  });

  const document = await buildWeeklyUsageReportDocument(conn, facility, range);

  await upsertReportStatus(conn, {
    facility,
    weekStart: range.weekStart,
    weekEnd: range.weekEnd,
    reportData: document,
    status: "complete",
    generatedAt: new Date(),
    failedAt: null,
    errorMessage: null,
    generatedByUserId: options.generatedByUserId ?? null,
  });

  return document;
}

async function buildWeeklyUsageReportDocument(
  conn: DB,
  facility: FacilitySummary,
  range: ReturnType<typeof getWeeklyUsageReportRange>
): Promise<WeeklyUsageReportDocument> {
  const facilityLessonsWhere = and(
    eq(playerInformation.facilityId, facility.id),
    gte(lesson.createdOn, range.queryStart.toISOString()),
    lt(lesson.createdOn, range.queryEndExclusive.toISOString())
  );
  const facilityPlayersWhere = and(
    eq(playerInformation.facilityId, facility.id),
    gte(playerInformation.created_at, range.queryStart.toISOString()),
    lt(playerInformation.created_at, range.queryEndExclusive.toISOString())
  );
  const facilityInjuriesWhere = and(
    eq(playerInformation.facilityId, facility.id),
    gte(injury.createdOn, range.queryStart.toISOString()),
    lt(injury.createdOn, range.queryEndExclusive.toISOString())
  );

  const [
    lessonTotalsRow,
    newPlayersRow,
    injuryTotalsRow,
    lessonActivePlayerRows,
    injuryActivePlayerRows,
    coachTotalRows,
    coachLessonTypeRows,
  ] = await Promise.all([
    conn
      .select({
        lessonsCreated: sql<number>`count(${lesson.id})::int`,
        activeCoaches: sql<number>`count(distinct ${lesson.coachId})::int`,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(facilityLessonsWhere)
      .then((rows) => rows[0]),
    conn
      .select({
        newPlayersAdded: sql<number>`count(${playerInformation.id})::int`,
      })
      .from(playerInformation)
      .where(facilityPlayersWhere)
      .then((rows) => rows[0]),
    conn
      .select({
        injuriesLogged: sql<number>`count(${injury.id})::int`,
      })
      .from(injury)
      .innerJoin(playerInformation, eq(injury.playerId, playerInformation.id))
      .where(facilityInjuriesWhere)
      .then((rows) => rows[0]),
    conn
      .select({
        playerId: lesson.playerId,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(facilityLessonsWhere)
      .groupBy(lesson.playerId),
    conn
      .select({
        playerId: injury.playerId,
      })
      .from(injury)
      .innerJoin(playerInformation, eq(injury.playerId, playerInformation.id))
      .where(facilityInjuriesWhere)
      .groupBy(injury.playerId),
    conn
      .select({
        coachId: lesson.coachId,
        coachName: users.name,
        lessonsLogged: sql<number>`count(${lesson.id})::int`,
        playersWorkedWith: sql<number>`count(distinct ${lesson.playerId})::int`,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .innerJoin(users, eq(lesson.coachId, users.id))
      .where(facilityLessonsWhere)
      .groupBy(lesson.coachId, users.name)
      .orderBy(sql`count(${lesson.id}) desc`),
    conn
      .select({
        coachId: lesson.coachId,
        lessonType: lesson.lessonType,
        lessonTypeCount: sql<number>`count(${lesson.id})::int`,
      })
      .from(lesson)
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .innerJoin(users, eq(lesson.coachId, users.id))
      .where(facilityLessonsWhere)
      .groupBy(lesson.coachId, lesson.lessonType)
      .orderBy(sql`count(${lesson.id}) desc`),
  ]);

  const activePlayerIds = new Set<string>();
  lessonActivePlayerRows.forEach((row) => activePlayerIds.add(row.playerId));
  injuryActivePlayerRows.forEach((row) => activePlayerIds.add(row.playerId));

  const coachMap = new Map<string, CoachSnapshot>();

  for (const row of coachTotalRows as CoachRow[]) {
    coachMap.set(row.coachId, {
      coachId: row.coachId,
      coachName: row.coachName?.trim() || "Unknown Coach",
      totals: {
        lessonsLogged: row.lessonsLogged,
        playersWorkedWith: row.playersWorkedWith,
      },
      lessonsByType: createLessonTypeCounts(),
    });
  }

  for (const row of coachLessonTypeRows as CoachLessonTypeRow[]) {
    const existing = coachMap.get(row.coachId);
    if (!existing) {
      continue;
    }

    existing.lessonsByType[mapLessonTypeKey(row.lessonType)] += row.lessonTypeCount;
  }

  const coachItems = Array.from(coachMap.values()).sort(
    (left, right) => right.totals.lessonsLogged - left.totals.lessonsLogged
  );

  return {
    ...createBaseDocument(facility, range),
    summary: {
      activePlayers: activePlayerIds.size,
      activeCoaches: lessonTotalsRow?.activeCoaches ?? 0,
      lessonsCreated: lessonTotalsRow?.lessonsCreated ?? 0,
      newPlayersAdded: newPlayersRow?.newPlayersAdded ?? 0,
      injuriesLogged: injuryTotalsRow?.injuriesLogged ?? 0,
    },
    coaches: {
      totalCoachesIncluded: coachItems.length,
      items: coachItems,
    },
  };
}

export interface GenerateWeeklyUsageReportsResult {
  processedFacilities: number;
  successfulFacilities: number;
  failedFacilities: number;
  weekStart: string;
  weekEnd: string;
  failures: Array<{
    facilityId: string;
    facilityName: string;
    error: string;
  }>;
}

export interface GenerateWeeklyUsageReportForFacilityResult {
  facilityId: string;
  facilityName: string;
  weekStart: string;
  weekEnd: string;
  label: string;
}

export async function generateWeeklyUsageReports(
  now = new Date(),
  conn: DB = db
): Promise<GenerateWeeklyUsageReportsResult> {
  const range = getWeeklyUsageReportRange(now);
  const allFacilities = await conn
    .select({
      id: facilities.id,
      name: facilities.name,
    })
    .from(facilities)
    .orderBy(facilities.name);

  const failures: GenerateWeeklyUsageReportsResult["failures"] = [];
  let successfulFacilities = 0;

  for (const facility of allFacilities) {
    try {
      await generateWeeklyUsageReportForFacilityRecord(facility, range, { conn });
      successfulFacilities += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const pendingDocument = createBaseDocument(facility, range);

      await upsertReportStatus(conn, {
        facility,
        weekStart: range.weekStart,
        weekEnd: range.weekEnd,
        reportData: pendingDocument,
        status: "failed",
        generatedAt: null,
        failedAt: new Date(),
        errorMessage: message,
        generatedByUserId: null,
      });

      failures.push({
        facilityId: facility.id,
        facilityName: facility.name,
        error: message,
      });
    }
  }

  return {
    processedFacilities: allFacilities.length,
    successfulFacilities,
    failedFacilities: failures.length,
    weekStart: range.weekStart.toISOString(),
    weekEnd: range.weekEnd.toISOString(),
    failures,
  };
}

export async function generateWeeklyUsageReportForFacility(
  facilityId: string,
  options: {
    now?: Date;
    conn?: DB;
    generatedByUserId?: string | null;
  } = {}
): Promise<GenerateWeeklyUsageReportForFacilityResult> {
  const conn = options.conn ?? db;
  const range = getWeeklyUsageReportRange(options.now ?? new Date());

  const [facility] = await conn
    .select({
      id: facilities.id,
      name: facilities.name,
    })
    .from(facilities)
    .where(eq(facilities.id, facilityId))
    .limit(1);

  if (!facility) {
    throw new Error("Facility not found");
  }

  await generateWeeklyUsageReportForFacilityRecord(facility, range, {
    conn,
    generatedByUserId: options.generatedByUserId ?? null,
  });

  return {
    facilityId: facility.id,
    facilityName: facility.name,
    weekStart: range.weekStart.toISOString(),
    weekEnd: range.weekEnd.toISOString(),
    label: range.label,
  };
}
