import { Chip } from "@heroui/react";

import { LessonCardData, LessonPlayerData } from "@/db/queries/lessons/lessonQueries.types";

import { ViewContext } from "./types";

interface LessonFatigueChipsProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  selectedPlayer?: LessonPlayerData;
  maxVisible?: number;
}

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function LessonFatigueChips({
  lesson,
  viewContext,
  selectedPlayer,
  maxVisible = 3,
}: LessonFatigueChipsProps) {
  const entries =
    viewContext === "player"
      ? (selectedPlayer ? [selectedPlayer] : lesson.players).flatMap((player) =>
          player.fatigueData.map((fatigue) => ({
            key: fatigue.id,
            playerName: null as string | null,
            report: fatigue.report,
            bodyPart: fatigue.bodyPart,
            severity: fatigue.severity,
          }))
        )
      : lesson.players.flatMap((player) =>
          player.fatigueData.map((fatigue) => ({
            key: fatigue.id,
            playerName: player.firstName,
            report: fatigue.report,
            bodyPart: fatigue.bodyPart,
            severity: fatigue.severity,
          }))
        );

  if (entries.length === 0) return null;

  const visibleEntries = entries.slice(0, maxVisible);
  const remaining = entries.length - visibleEntries.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleEntries.map((entry) => {
        const segments = [
          entry.playerName,
          toTitleCase(entry.report),
          entry.bodyPart,
          typeof entry.severity === "number" ? `${entry.severity}/10` : null,
        ].filter(Boolean);

        return (
          <Chip
            key={entry.key}
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800",
              content: "text-xs text-amber-700 dark:text-amber-300",
            }}
          >
            {segments.join(" | ")}
          </Chip>
        );
      })}
      {remaining > 0 && (
        <Chip
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
            content: "text-xs",
          }}
        >
          +{remaining} more
        </Chip>
      )}
    </div>
  );
}

