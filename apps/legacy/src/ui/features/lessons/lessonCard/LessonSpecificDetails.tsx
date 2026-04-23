import { Chip } from "@heroui/react";

import { LessonCardData, LessonPlayerData } from "@/db/queries/lessons/lessonQueries.types";

import { countStrengthMetrics } from "./lessonCard.helpers";
import { ViewContext } from "./types";

interface LessonSpecificDetailsProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  selectedPlayer?: LessonPlayerData;
}

function renderPitchingDetails(
  lesson: LessonCardData,
  viewContext: ViewContext,
  selectedPlayer?: LessonPlayerData
) {
  if (lesson.lessonType !== "pitching") return null;

  if (viewContext === "player") {
    const pitching = selectedPlayer?.lessonSpecific.pitching;
    if (!pitching?.summary && !pitching?.focus) return null;

    return (
      <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
        {pitching.summary && (
          <p className="line-clamp-2">
            <strong>Summary:</strong> {pitching.summary}
          </p>
        )}
        {pitching.focus && (
          <p className="line-clamp-2">
            <strong>Focus:</strong> {pitching.focus}
          </p>
        )}
      </div>
    );
  }

  const rows = lesson.players.flatMap((player) => {
    const pitching = player.lessonSpecific.pitching;
    if (!pitching?.summary && !pitching?.focus) return [];

    const output: Array<{ key: string; label: string; value: string }> = [];
    if (pitching.summary) {
      output.push({
        key: `${player.id}-summary`,
        label: `${player.firstName}: Summary`,
        value: pitching.summary,
      });
    }
    if (pitching.focus) {
      output.push({
        key: `${player.id}-focus`,
        label: `${player.firstName}: Focus`,
        value: pitching.focus,
      });
    }
    return output;
  });

  if (rows.length === 0) return null;

  return (
    <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
      {rows.map((row) => (
        <p key={row.key} className="line-clamp-2">
          <strong>{row.label}</strong> {row.value}
        </p>
      ))}
    </div>
  );
}

function renderStrengthDetails(
  lesson: LessonCardData,
  viewContext: ViewContext,
  selectedPlayer?: LessonPlayerData
) {
  if (lesson.lessonType !== "strength") return null;

  if (viewContext === "player") {
    const count = countStrengthMetrics(selectedPlayer?.lessonSpecific.strength?.tsIso);
    if (count === 0) return null;

    return (
      <Chip
        size="sm"
        variant="flat"
        classNames={{
          base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
          content: "text-xs",
        }}
      >
        TS ISO: {count} metrics
      </Chip>
    );
  }

  const chips = lesson.players
    .map((player) => ({
      playerName: player.firstName,
      count: countStrengthMetrics(player.lessonSpecific.strength?.tsIso),
      id: player.id,
    }))
    .filter((entry) => entry.count > 0);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((entry) => (
        <Chip
          key={entry.id}
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
            content: "text-xs",
          }}
        >
          {entry.playerName} | TS ISO: {entry.count}
        </Chip>
      ))}
    </div>
  );
}

export function LessonSpecificDetails({
  lesson,
  viewContext,
  selectedPlayer,
}: LessonSpecificDetailsProps) {
  const pitching = renderPitchingDetails(lesson, viewContext, selectedPlayer);
  const strength = renderStrengthDetails(lesson, viewContext, selectedPlayer);

  if (!pitching && !strength) return null;

  return (
    <div className="space-y-2">
      {pitching}
      {strength}
    </div>
  );
}


