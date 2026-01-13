import { count, desc, eq, inArray } from "drizzle-orm";

import db from "@/db";
import {
  LessonCardData,
  LessonQueryFilters,
} from "@/db/queries/lessons/lessonQueries.types";
import {
  buildWhereConditions,
  fetchBaseLessons,
  fetchLessonMechanicsBatch,
  fetchLessonPlayersBatch,
  transformToLessonCard,
} from "@/db/queries/lessons/lessonQueries.utils";
import { lesson, lessonPlayers, playerInformation, users } from "@/db/schema";

/**
 * Fetch all lessons with full data for lesson cards
 */
export async function getAllLessons(
  options: { limit?: number; offset?: number } = {}
): Promise<LessonCardData[]> {
  return getLessonsWithFilters(options);
}

/**
 * Fetch lessons by player ID
 * Queries against lesson.playerId which covers both:
 * - Legacy lessons (only player reference)
 * - Modern lessons (first player duplicated here for compatibility)
 */
export async function getLessonsByPlayerId(
  playerId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<LessonCardData[]> {
  return getLessonsWithFilters({ ...options, playerId });
}

/**
 * Fetch lessons by coach ID
 */
export async function getLessonsByCoachId(
  coachId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<LessonCardData[]> {
  return getLessonsWithFilters({ ...options, coachId });
}

/**
 * Fetch lessons by both player ID and coach ID
 */
export async function getLessonsByPlayerAndCoach(
  playerId: string,
  coachId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<LessonCardData[]> {
  return getLessonsWithFilters({ ...options, playerId, coachId });
}

/**
 * Core function: Fetch lessons with flexible filtering
 * Supports any combination of filters
 */
export async function getLessonsWithFilters(
  filters: LessonQueryFilters = {}
): Promise<LessonCardData[]> {
  const baseLessons = await fetchBaseLessons(filters);

  if (baseLessons.length === 0) return [];

  const lessonIds = baseLessons.map((l) => l.lesson.id);

  // Batch fetch related data in parallel
  const [playersMap, mechanicsMap] = await Promise.all([
    fetchLessonPlayersBatch(lessonIds),
    fetchLessonMechanicsBatch(lessonIds),
  ]);

  return baseLessons.map((rawLesson) => {
    const lessonPlayersData = playersMap.get(rawLesson.lesson.id) ?? [];
    const lessonMechanicsData = mechanicsMap.get(rawLesson.lesson.id) ?? [];
    return transformToLessonCard(
      rawLesson,
      lessonPlayersData,
      lessonMechanicsData
    );
  });
}

/**
 * Fetch a single lesson by ID with full data
 */
export async function getLessonById(
  lessonId: string
): Promise<LessonCardData | null> {
  const baseLessons = await db
    .select({
      lesson: lesson,
      coach: users,
      legacyPlayer: playerInformation,
    })
    .from(lesson)
    .innerJoin(users, eq(lesson.coachId, users.id))
    .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
    .where(eq(lesson.id, lessonId))
    .limit(1);

  if (baseLessons.length === 0) return null;

  const [playersMap, mechanicsMap] = await Promise.all([
    fetchLessonPlayersBatch([lessonId]),
    fetchLessonMechanicsBatch([lessonId]),
  ]);

  const lessonPlayersData = playersMap.get(lessonId) ?? [];
  const lessonMechanicsData = mechanicsMap.get(lessonId) ?? [];

  return transformToLessonCard(
    baseLessons[0],
    lessonPlayersData,
    lessonMechanicsData
  );
}

/**
 * Fetch ALL lessons for a player (appears in lesson.playerId OR lessonPlayers)
 * Use this when you need to find every lesson a player has participated in,
 * including group lessons where they weren't the first player listed
 */
export async function getAllLessonsForPlayer(
  playerId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<LessonCardData[]> {
  // Get lesson IDs where player is in lesson.playerId (legacy + first player in modern)
  const directLessonIds = await db
    .select({ id: lesson.id })
    .from(lesson)
    .where(eq(lesson.playerId, playerId));

  // Get lesson IDs where player appears in lessonPlayers
  const participantLessonIds = await db
    .selectDistinct({ lessonId: lessonPlayers.lessonId })
    .from(lessonPlayers)
    .where(eq(lessonPlayers.playerId, playerId));

  // Combine and deduplicate
  const allLessonIds = [
    ...new Set([
      ...directLessonIds.map((r) => r.id),
      ...participantLessonIds.map((r) => r.lessonId),
    ]),
  ];

  if (allLessonIds.length === 0) return [];

  // Fetch those lessons with full data
  let query = db
    .select({
      lesson: lesson,
      coach: users,
      legacyPlayer: playerInformation,
    })
    .from(lesson)
    .innerJoin(users, eq(lesson.coachId, users.id))
    .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
    .where(inArray(lesson.id, allLessonIds))
    .orderBy(desc(lesson.lessonDate))
    .$dynamic();

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.offset(options.offset);
  }

  const baseLessons = await query;

  if (baseLessons.length === 0) return [];

  const fetchedLessonIds = baseLessons.map((l) => l.lesson.id);

  const [playersMap, mechanicsMap] = await Promise.all([
    fetchLessonPlayersBatch(fetchedLessonIds),
    fetchLessonMechanicsBatch(fetchedLessonIds),
  ]);

  return baseLessons.map((rawLesson) => {
    const lessonPlayersData = playersMap.get(rawLesson.lesson.id) ?? [];
    const lessonMechanicsData = mechanicsMap.get(rawLesson.lesson.id) ?? [];
    return transformToLessonCard(
      rawLesson,
      lessonPlayersData,
      lessonMechanicsData
    );
  });
}

/**
 * Count total lessons matching filters
 */
export async function countLessons(
  filters: Omit<LessonQueryFilters, "limit" | "offset"> = {}
): Promise<number> {
  const whereConditions = buildWhereConditions(filters);

  let query = db.select({ total: count() }).from(lesson).$dynamic();

  if (whereConditions) {
    query = query.where(whereConditions);
  }

  const result = await query;
  return result[0]?.total ?? 0;
}

/**
 * Count all lessons for a player (in lesson.playerId OR lessonPlayers)
 */
export async function countAllLessonsForPlayer(
  playerId: string
): Promise<number> {
  const directLessonIds = await db
    .select({ id: lesson.id })
    .from(lesson)
    .where(eq(lesson.playerId, playerId));

  const participantLessonIds = await db
    .selectDistinct({ lessonId: lessonPlayers.lessonId })
    .from(lessonPlayers)
    .where(eq(lessonPlayers.playerId, playerId));

  const allLessonIds = new Set([
    ...directLessonIds.map((r) => r.id),
    ...participantLessonIds.map((r) => r.lessonId),
  ]);

  return allLessonIds.size;
}
