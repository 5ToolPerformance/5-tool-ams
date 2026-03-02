import {
  LessonCardData,
  LessonPlayerData,
  StrengthTsIsoData,
} from "@/db/queries/lessons/lessonQueries.types";

import { ViewContext } from "./types";

export function getSelectedPlayer(
  lesson: LessonCardData,
  viewContext: ViewContext,
  playerId?: string
): LessonPlayerData | undefined {
  if (viewContext !== "player") return undefined;

  return lesson.players.find((player) =>
    playerId ? player.id === playerId : lesson.players.length === 1
  );
}

export function getPlayersForContext(
  lesson: LessonCardData,
  viewContext: ViewContext,
  selectedPlayer?: LessonPlayerData
): LessonPlayerData[] {
  if (viewContext !== "player") return lesson.players;
  if (selectedPlayer) return [selectedPlayer];
  return lesson.players;
}

export function countStrengthMetrics(tsIso?: StrengthTsIsoData): number {
  if (!tsIso) return 0;

  return Object.values(tsIso).filter(
    (value) => typeof value === "number" && !Number.isNaN(value)
  ).length;
}

