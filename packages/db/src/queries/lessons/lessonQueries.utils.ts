import { SQL, and, asc, desc, eq, inArray, isNull } from "drizzle-orm";

import db from "@/db";
import {
  LessonAttachmentData,
  LessonCardData,
  LessonCoachData,
  LessonDrillData,
  LessonFatigueData,
  LessonMechanicData,
  LessonPlayerRoutineData,
  LessonPlayerData,
  LessonQueryFilters,
  StrengthLessonData,
} from "@/db/queries/lessons/lessonQueries.types";
import {
  attachmentFiles,
  attachments,
  drills,
  injuryBodyPart,
  lesson,
  lessonDrills,
  lessonPlayerFatigue,
  lessonPlayerRoutines,
  lessonMechanics,
  lessonPlayers,
  manualTsIso,
  mechanics,
  playerInformation,
  pitchingLessonPlayers,
  users,
} from "@/db/schema";

interface RawLessonRow {
  lesson: typeof lesson.$inferSelect;
  coach: typeof users.$inferSelect;
  legacyPlayer: typeof playerInformation.$inferSelect;
}

interface RawLessonPlayerRow {
  lessonPlayer: typeof lessonPlayers.$inferSelect;
  player: typeof playerInformation.$inferSelect;
}

interface RawLessonMechanicRow {
  lessonMechanic: typeof lessonMechanics.$inferSelect;
  mechanic: typeof mechanics.$inferSelect;
}

interface RawLessonDrillRow {
  lessonDrill: typeof lessonDrills.$inferSelect;
  drill: typeof drills.$inferSelect;
}

interface RawLessonFatigueRow {
  fatigue: typeof lessonPlayerFatigue.$inferSelect;
  bodyPart: typeof injuryBodyPart.$inferSelect;
}

interface RawLessonAttachmentRow {
  attachment: typeof attachments.$inferSelect;
  file:
    | {
        originalFileName: string | null;
        mimeType: string | null;
        fileSizeBytes: number | null;
        storageKey: string | null;
      }
     | null;
}

interface RawLessonPlayerRoutineRow {
  lessonPlayerRoutine: typeof lessonPlayerRoutines.$inferSelect;
}

type RawPitchingLessonSpecificRow = typeof pitchingLessonPlayers.$inferSelect;
type RawStrengthLessonSpecificRow = typeof manualTsIso.$inferSelect;

/**
 * Build WHERE conditions based on filters
 */
export function buildWhereConditions(
  filters: LessonQueryFilters
): SQL | undefined {
  const conditions: SQL[] = [];

  if (filters.playerId) {
    conditions.push(eq(lesson.playerId, filters.playerId));
  }

  if (filters.coachId) {
    conditions.push(eq(lesson.coachId, filters.coachId));
  }

  if (filters.lessonType) {
    conditions.push(eq(lesson.lessonType, filters.lessonType));
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

/**
 * Fetch base lesson data with coach and legacy player fallback
 */
export async function fetchBaseLessons(
  filters: LessonQueryFilters = {}
): Promise<RawLessonRow[]> {
  const whereConditions = buildWhereConditions(filters);

  let query = db
    .select({
      lesson: lesson,
      coach: users,
      legacyPlayer: playerInformation,
    })
    .from(lesson)
    .innerJoin(users, eq(lesson.coachId, users.id))
    .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
    .orderBy(desc(lesson.lessonDate))
    .$dynamic();

  if (whereConditions) {
    query = query.where(whereConditions);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.offset(filters.offset);
  }

  return query;
}

export async function fetchLessonPlayersBatch(
  lessonIds: string[]
): Promise<Map<string, RawLessonPlayerRow[]>> {
  if (lessonIds.length === 0) return new Map();

  const rows = await db
    .select({
      lessonPlayer: lessonPlayers,
      player: playerInformation,
    })
    .from(lessonPlayers)
    .innerJoin(
      playerInformation,
      eq(lessonPlayers.playerId, playerInformation.id)
    )
    .where(inArray(lessonPlayers.lessonId, lessonIds));

  const playerMap = new Map<string, RawLessonPlayerRow[]>();
  for (const row of rows) {
    const existing = playerMap.get(row.lessonPlayer.lessonId) ?? [];
    existing.push(row);
    playerMap.set(row.lessonPlayer.lessonId, existing);
  }

  return playerMap;
}

/**
 * Fetch lesson mechanics for multiple lesson IDs in single query
 */
export async function fetchLessonMechanicsBatch(
  lessonIds: string[]
): Promise<Map<string, RawLessonMechanicRow[]>> {
  if (lessonIds.length === 0) return new Map();

  const rows = await db
    .select({
      lessonMechanic: lessonMechanics,
      mechanic: mechanics,
    })
    .from(lessonMechanics)
    .innerJoin(mechanics, eq(lessonMechanics.mechanicId, mechanics.id))
    .where(inArray(lessonMechanics.lessonId, lessonIds));

  const mechanicMap = new Map<string, RawLessonMechanicRow[]>();
  for (const row of rows) {
    const existing = mechanicMap.get(row.lessonMechanic.lessonId) ?? [];
    existing.push(row);
    mechanicMap.set(row.lessonMechanic.lessonId, existing);
  }

  return mechanicMap;
}

export async function fetchLessonDrillsBatch(
  lessonPlayerIds: string[]
): Promise<Map<string, RawLessonDrillRow[]>> {
  if (lessonPlayerIds.length === 0) return new Map();

  const rows = await db
    .select({
      lessonDrill: lessonDrills,
      drill: drills,
    })
    .from(lessonDrills)
    .innerJoin(drills, eq(lessonDrills.drillId, drills.id))
    .where(inArray(lessonDrills.lessonPlayerId, lessonPlayerIds));

  const drillMap = new Map<string, RawLessonDrillRow[]>();
  for (const row of rows) {
    const existing = drillMap.get(row.lessonDrill.lessonPlayerId) ?? [];
    existing.push(row);
    drillMap.set(row.lessonDrill.lessonPlayerId, existing);
  }

  return drillMap;
}

export async function fetchLessonFatigueBatch(
  lessonPlayerIds: string[]
): Promise<Map<string, RawLessonFatigueRow[]>> {
  if (lessonPlayerIds.length === 0) return new Map();

  const rows = await db
    .select({
      fatigue: lessonPlayerFatigue,
      bodyPart: injuryBodyPart,
    })
    .from(lessonPlayerFatigue)
    .innerJoin(
      injuryBodyPart,
      eq(lessonPlayerFatigue.bodyPartId, injuryBodyPart.id)
    )
    .where(inArray(lessonPlayerFatigue.lessonPlayerId, lessonPlayerIds));

  const fatigueMap = new Map<string, RawLessonFatigueRow[]>();
  for (const row of rows) {
    const existing = fatigueMap.get(row.fatigue.lessonPlayerId) ?? [];
    existing.push(row);
    fatigueMap.set(row.fatigue.lessonPlayerId, existing);
  }

  return fatigueMap;
}

export async function fetchLessonAttachmentsBatch(
  lessonPlayerIds: string[]
): Promise<Map<string, RawLessonAttachmentRow[]>> {
  if (lessonPlayerIds.length === 0) return new Map();

  const rows = await db
    .select({
      attachment: attachments,
      file: {
        originalFileName: attachmentFiles.originalFileName,
        mimeType: attachmentFiles.mimeType,
        fileSizeBytes: attachmentFiles.fileSizeBytes,
        storageKey: attachmentFiles.storageKey,
      },
    })
    .from(attachments)
    .leftJoin(attachmentFiles, eq(attachmentFiles.attachmentId, attachments.id))
    .where(
      and(
        inArray(attachments.lessonPlayerId, lessonPlayerIds),
        isNull(attachments.deletedAt)
      )
    );

  const attachmentMap = new Map<string, RawLessonAttachmentRow[]>();
  for (const row of rows) {
    if (!row.attachment.lessonPlayerId) continue;
    const existing = attachmentMap.get(row.attachment.lessonPlayerId) ?? [];
    existing.push(row);
    attachmentMap.set(row.attachment.lessonPlayerId, existing);
  }

  return attachmentMap;
}

export async function fetchLessonPlayerRoutinesBatch(
  lessonPlayerIds: string[]
): Promise<Map<string, RawLessonPlayerRoutineRow[]>> {
  if (lessonPlayerIds.length === 0) return new Map();

  const rows = await db
    .select({
      lessonPlayerRoutine: lessonPlayerRoutines,
    })
    .from(lessonPlayerRoutines)
    .where(inArray(lessonPlayerRoutines.lessonPlayerId, lessonPlayerIds));

  const routineMap = new Map<string, RawLessonPlayerRoutineRow[]>();
  for (const row of rows) {
    const existing = routineMap.get(row.lessonPlayerRoutine.lessonPlayerId) ?? [];
    existing.push(row);
    routineMap.set(row.lessonPlayerRoutine.lessonPlayerId, existing);
  }

  return routineMap;
}

export async function fetchPitchingLessonSpecificBatch(
  lessonPlayerIds: string[]
): Promise<Map<string, RawPitchingLessonSpecificRow>> {
  if (lessonPlayerIds.length === 0) return new Map();

  const rows = await db
    .select()
    .from(pitchingLessonPlayers)
    .where(inArray(pitchingLessonPlayers.lessonPlayerId, lessonPlayerIds))
    .orderBy(asc(pitchingLessonPlayers.id));

  const pitchingMap = new Map<string, RawPitchingLessonSpecificRow>();
  for (const row of rows) {
    if (!pitchingMap.has(row.lessonPlayerId)) {
      pitchingMap.set(row.lessonPlayerId, row);
    }
  }

  return pitchingMap;
}

export async function fetchStrengthLessonSpecificBatch(
  lessonPlayerIds: string[]
): Promise<Map<string, RawStrengthLessonSpecificRow>> {
  if (lessonPlayerIds.length === 0) return new Map();

  const rows = await db
    .select()
    .from(manualTsIso)
    .where(inArray(manualTsIso.lessonPlayerId, lessonPlayerIds))
    .orderBy(asc(manualTsIso.id));

  const strengthMap = new Map<string, RawStrengthLessonSpecificRow>();
  for (const row of rows) {
    if (!strengthMap.has(row.lessonPlayerId)) {
      strengthMap.set(row.lessonPlayerId, row);
    }
  }

  return strengthMap;
}

/**
 * Transform raw data into LessonCardData format
 */
export function transformToLessonCard(
  rawLesson: RawLessonRow,
  lessonPlayersData: RawLessonPlayerRow[],
  lessonMechanicsData: RawLessonMechanicRow[],
  lessonDrillsData: RawLessonDrillRow[],
  fatigueMap: Map<string, RawLessonFatigueRow[]>,
  attachmentsMap: Map<string, RawLessonAttachmentRow[]>,
  lessonPlayerRoutineMap: Map<string, RawLessonPlayerRoutineRow[]>,
  pitchingSpecificMap: Map<string, RawPitchingLessonSpecificRow>,
  strengthSpecificMap: Map<string, RawStrengthLessonSpecificRow>
): LessonCardData {
  const { lesson: lessonData, coach, legacyPlayer } = rawLesson;

  const coachData: LessonCoachData = {
    id: coach.id,
    name: coach.name,
    email: coach.email,
    image: coach.image,
  };

  // Determine if legacy based on presence of lessonPlayers records
  const isLegacy = lessonPlayersData.length === 0;

  // Build players array - use lessonPlayers if available, otherwise fall back to legacy
  let players: LessonPlayerData[];

  if (isLegacy) {
    // Legacy lesson: use player from lesson.playerId
    players = [
      {
        id: legacyPlayer.id,
        lessonPlayerId: null,
        firstName: legacyPlayer.firstName,
        lastName: legacyPlayer.lastName,
        profilePictureUrl: legacyPlayer.profilePictureUrl,
        position: legacyPlayer.position,
        throws: legacyPlayer.throws,
        hits: legacyPlayer.hits,
        sport: legacyPlayer.sport,
        notes: null,
        fatigueData: [],
        attachments: [],
        appliedRoutines: [],
        lessonSpecific: {
          pitching: null,
          strength: null,
        },
      },
    ];
  } else {
    // Modern lesson: use lessonPlayers table
    players = lessonPlayersData.map((row) => {
      const lessonPlayerId = row.lessonPlayer.id;

      const fatigueData: LessonFatigueData[] = (
        fatigueMap.get(lessonPlayerId) ?? []
      ).map((fatigueRow) => ({
        id: fatigueRow.fatigue.id,
        report: fatigueRow.fatigue.report,
        severity: fatigueRow.fatigue.severity,
        bodyPartId: fatigueRow.fatigue.bodyPartId,
        bodyPart: fatigueRow.bodyPart.name,
      }));

      const attachmentsData: LessonAttachmentData[] = (
        attachmentsMap.get(lessonPlayerId) ?? []
      ).map((attachmentRow) => ({
        id: attachmentRow.attachment.id,
        lessonPlayerId,
        type: attachmentRow.attachment.type,
        source: attachmentRow.attachment.source,
        evidenceCategory: attachmentRow.attachment.evidenceCategory,
        visibility: attachmentRow.attachment.visibility,
        documentType: attachmentRow.attachment.documentType,
        notes: attachmentRow.attachment.notes,
        effectiveDate: attachmentRow.attachment.effectiveDate,
        createdAt: attachmentRow.attachment.createdAt,
        file: attachmentRow.file,
      }));

      const appliedRoutines: LessonPlayerRoutineData[] = (
        lessonPlayerRoutineMap.get(lessonPlayerId) ?? []
      ).map((routineRow) => ({
        id: routineRow.lessonPlayerRoutine.id,
        sourceRoutineId: routineRow.lessonPlayerRoutine.sourceRoutineId,
        sourceRoutineSource: routineRow.lessonPlayerRoutine.sourceRoutineSource,
        sourceRoutineType: routineRow.lessonPlayerRoutine
          .sourceRoutineType as "partial_lesson" | "full_lesson",
        sourceRoutineTitle: routineRow.lessonPlayerRoutine.sourceRoutineTitle,
        sourceRoutineDocument: routineRow.lessonPlayerRoutine
          .sourceRoutineDocument as LessonPlayerRoutineData["sourceRoutineDocument"],
      }));

      const pitchingSpecific =
        lessonData.lessonType === "pitching"
          ? pitchingSpecificMap.get(lessonPlayerId) ?? null
          : null;
      const strengthSpecific =
        lessonData.lessonType === "strength"
          ? strengthSpecificMap.get(lessonPlayerId) ?? null
          : null;

      const strengthLessonSpecificData: StrengthLessonData | null =
        strengthSpecific
          ? {
              tsIso: {
                shoulderErL: strengthSpecific.shoulderErL,
                shoulderErR: strengthSpecific.shoulderErR,
                shoulderErTtpfL: strengthSpecific.shoulderErTtpfL,
                shoulderErTtpfR: strengthSpecific.shoulderErTtpfR,
                shoulderIrL: strengthSpecific.shoulderIrL,
                shoulderIrR: strengthSpecific.shoulderIrR,
                shoulderIrTtpfL: strengthSpecific.shoulderIrTtpfL,
                shoulderIrTtpfR: strengthSpecific.shoulderIrTtpfR,
                shoulderRotL: strengthSpecific.shoulderRotL,
                shoulderRotR: strengthSpecific.shoulderRotR,
                shoulderRotRfdL: strengthSpecific.shoulderRotRfdL,
                shoulderRotRfdR: strengthSpecific.shoulderRotRfdR,
                hipRotL: strengthSpecific.hipRotL,
                hipRotR: strengthSpecific.hipRotR,
                hipRotRfdL: strengthSpecific.hipRotRfdL,
                hipRotRfdR: strengthSpecific.hipRotRfdR,
              },
            }
          : null;

      return {
        id: row.player.id,
        lessonPlayerId,
        firstName: row.player.firstName,
        lastName: row.player.lastName,
        profilePictureUrl: row.player.profilePictureUrl,
        position: row.player.position,
        throws: row.player.throws,
        hits: row.player.hits,
        sport: row.player.sport,
        notes: row.lessonPlayer.notes,
        fatigueData,
        attachments: attachmentsData,
        appliedRoutines,
        lessonSpecific: {
          pitching: pitchingSpecific
            ? {
                summary: pitchingSpecific.summary,
                focus: pitchingSpecific.focus,
              }
            : null,
          strength: strengthLessonSpecificData,
        },
      };
    });
  }

  // Transform mechanics
  const mechanicsData: LessonMechanicData[] = lessonMechanicsData.map(
    (row) => ({
      id: row.lessonMechanic.id,
      mechanicId: row.mechanic.id,
      name: row.mechanic.name,
      description: row.mechanic.description,
      type: row.mechanic.type,
      tags: row.mechanic.tags,
      notes: row.lessonMechanic.notes,
      playerId: row.lessonMechanic.playerId,
    })
  );

  const drillsData: LessonDrillData[] = lessonDrillsData.map((row) => ({
    id: row.lessonDrill.id,
    drillId: row.lessonDrill.drillId,
    title: row.drill.title,
    description: row.drill.description,
    discipline: row.drill.discipline,
    notes: row.lessonDrill.notes,
    lessonPlayerId: row.lessonDrill.lessonPlayerId,
  }));

  return {
    id: lessonData.id,
    lessonType: lessonData.lessonType,
    notes: lessonData.notes,
    createdOn: lessonData.createdOn,
    lessonDate: lessonData.lessonDate,
    coach: coachData,
    players,
    mechanics: mechanicsData,
    drills: drillsData,
    isLegacy,
  };
}
