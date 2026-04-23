import { and, eq, inArray } from "drizzle-orm";

import db from "@ams/db";
import { listActiveDisciplines } from "@ams/db/queries/config/listActiveDisciplines";
import {
  developmentPlanRoutines,
  universalRoutines,
} from "@ams/db/schema";
import type {
  LessonRoutineSource,
  LessonType,
} from "@ams/contracts/types/lesson-form";
import type { LessonRoutineOption } from "@ams/contracts/types/lesson-routines";
import { DomainError } from "@ams/domain/errors";

import type { RoutineDocumentV1 } from "@ams/domain/routines/types";

type RequestedRoutineSelection = {
  source: LessonRoutineSource;
  routineId: string;
};

function isRoutineDocument(value: unknown): value is RoutineDocumentV1 {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    "mechanics" in value &&
    "blocks" in value
  );
}

export async function getLessonRoutineOptions(params: {
  playerIds: string[];
  facilityId: string;
}) {
  if (params.playerIds.length === 0) {
    return [];
  }

  const [disciplines, planRows, universalRows] = await Promise.all([
    listActiveDisciplines(db),
    db
      .select({
        playerId: developmentPlanRoutines.playerId,
        disciplineId: developmentPlanRoutines.disciplineId,
        disciplineKey: developmentPlanRoutines.disciplineId,
        routineId: developmentPlanRoutines.id,
        routineType: developmentPlanRoutines.routineType,
        title: developmentPlanRoutines.title,
        isActive: developmentPlanRoutines.isActive,
        documentData: developmentPlanRoutines.documentData,
      })
      .from(developmentPlanRoutines)
      .where(
        and(
          inArray(developmentPlanRoutines.playerId, params.playerIds),
          eq(developmentPlanRoutines.isActive, true)
        )
      ),
    db
      .select({
        routineId: universalRoutines.id,
        routineType: universalRoutines.routineType,
        title: universalRoutines.title,
        disciplineId: universalRoutines.disciplineId,
        documentData: universalRoutines.documentData,
      })
      .from(universalRoutines)
      .where(
        and(
          eq(universalRoutines.facilityId, params.facilityId),
          eq(universalRoutines.isActive, true)
        )
      ),
  ]);

  const disciplineKeyById = new Map(disciplines.map((item) => [item.id, item.key]));
  const options: LessonRoutineOption[] = [];

  for (const row of planRows) {
    if (!row.playerId || !row.disciplineId) {
      continue;
    }

    const disciplineKey = disciplineKeyById.get(row.disciplineId);
    if (
      !disciplineKey ||
      row.routineType === "progression" ||
      !isRoutineDocument(row.documentData)
    ) {
      continue;
    }

    options.push({
      key: `player:${row.routineId}`,
      source: "player",
      routineId: row.routineId,
      routineType: row.routineType,
      title: row.title,
      playerId: row.playerId,
      disciplineId: row.disciplineId,
      disciplineKey: disciplineKey as LessonType,
      document: row.documentData,
    });
  }

  for (const row of universalRows) {
    const disciplineKey = disciplineKeyById.get(row.disciplineId);
    if (
      !disciplineKey ||
      row.routineType === "progression" ||
      !isRoutineDocument(row.documentData)
    ) {
      continue;
    }

    options.push({
      key: `universal:${row.routineId}`,
      source: "universal",
      routineId: row.routineId,
      routineType: row.routineType,
      title: row.title,
      playerId: null,
      disciplineId: row.disciplineId,
      disciplineKey: disciplineKey as LessonType,
      document: row.documentData,
    });
  }

  return options;
}

export async function resolveLessonRoutineSelections(params: {
  selectionsByPlayerId: Record<string, RequestedRoutineSelection[]>;
  lessonType: LessonType;
  facilityId: string;
}) {
  const routineOptions = await getLessonRoutineOptions({
    playerIds: Object.keys(params.selectionsByPlayerId),
    facilityId: params.facilityId,
  });
  const optionByKey = new Map(routineOptions.map((option) => [option.key, option]));
  const resolved = new Map<string, LessonRoutineOption[]>();

  for (const [playerId, selections] of Object.entries(params.selectionsByPlayerId)) {
    const playerResolved: LessonRoutineOption[] = [];

    for (const selection of selections) {
      const key = `${selection.source}:${selection.routineId}`;
      const option = optionByKey.get(key);

      if (!option) {
        throw new DomainError("Selected routine is not available.");
      }

      if (option.disciplineKey !== params.lessonType) {
        throw new DomainError("Routine discipline does not match lesson type.");
      }

      if (option.source === "player" && option.playerId !== playerId) {
        throw new DomainError("Player routines can only be applied to their owner.");
      }

      playerResolved.push(option);
    }

    const hasFull = playerResolved.some((item) => item.routineType === "full_lesson");
    const hasPartial = playerResolved.some(
      (item) => item.routineType === "partial_lesson"
    );

    if (hasFull && hasPartial) {
      throw new DomainError(
        "Full lesson and partial lesson routines cannot be mixed for the same player."
      );
    }

    if (
      playerResolved.filter((item) => item.routineType === "full_lesson").length > 1
    ) {
      throw new DomainError("Only one full lesson routine can be applied per player.");
    }

    resolved.set(playerId, playerResolved);
  }

  return resolved;
}
