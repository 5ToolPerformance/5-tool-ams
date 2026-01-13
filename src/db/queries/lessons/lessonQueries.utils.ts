import { SQL, and, desc, eq, inArray } from "drizzle-orm";

import db from "@/db";
import {
  LessonCardData,
  LessonCoachData,
  LessonMechanicData,
  LessonPlayerData,
  LessonQueryFilters,
} from "@/db/queries/lessons/lessonQueries.types";
import {
  lesson,
  lessonMechanics,
  lessonPlayers,
  mechanics,
  playerInformation,
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

/**
 * Transform raw data into LessonCardData format
 */
export function transformToLessonCard(
  rawLesson: RawLessonRow,
  lessonPlayersData: RawLessonPlayerRow[],
  lessonMechanicsData: RawLessonMechanicRow[]
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
      },
    ];
  } else {
    // Modern lesson: use lessonPlayers table
    players = lessonPlayersData.map((row) => ({
      id: row.player.id,
      lessonPlayerId: row.lessonPlayer.id,
      firstName: row.player.firstName,
      lastName: row.player.lastName,
      profilePictureUrl: row.player.profilePictureUrl,
      position: row.player.position,
      throws: row.player.throws,
      hits: row.player.hits,
      sport: row.player.sport,
      notes: row.lessonPlayer.notes,
    }));
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

  return {
    id: lessonData.id,
    lessonType: lessonData.lessonType,
    notes: lessonData.notes,
    createdOn: lessonData.createdOn,
    lessonDate: lessonData.lessonDate,
    coach: coachData,
    players,
    mechanics: mechanicsData,
    isLegacy,
  };
}
