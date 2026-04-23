import { Chip, Tooltip } from "@heroui/react";
import { ListChecks } from "lucide-react";

import { LessonCardData, LessonPlayerData } from "@/db/queries/lessons/lessonQueries.types";

import { ViewContext } from "./types";

interface LessonDrillsBadgeProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  selectedPlayer?: LessonPlayerData;
}

interface DrillGroup {
  key: string;
  label: string;
  titles: string[];
}

const MAX_TOOLTIP_ITEMS = 8;

function getContextDrills(
  lesson: LessonCardData,
  viewContext: ViewContext,
  selectedPlayer?: LessonPlayerData
) {
  if (viewContext !== "player") {
    return lesson.drills;
  }

  if (!selectedPlayer?.lessonPlayerId) {
    return lesson.drills;
  }

  return lesson.drills.filter(
    (drill) => drill.lessonPlayerId === selectedPlayer.lessonPlayerId
  );
}

function buildCoachGroups(lesson: LessonCardData, drills: LessonCardData["drills"]) {
  const playerNameByLessonPlayerId = new Map<string, string>();
  for (const player of lesson.players) {
    if (!player.lessonPlayerId) continue;
    playerNameByLessonPlayerId.set(player.lessonPlayerId, player.firstName);
  }

  const grouped = new Map<string, DrillGroup>();
  for (const drill of drills) {
    const key = drill.lessonPlayerId ?? "unassigned";
    const label = playerNameByLessonPlayerId.get(key) ?? "Unassigned";
    const entry = grouped.get(key) ?? { key, label, titles: [] };
    entry.titles.push(drill.title);
    grouped.set(key, entry);
  }

  return Array.from(grouped.values());
}

export function LessonDrillsBadge({
  lesson,
  viewContext,
  selectedPlayer,
}: LessonDrillsBadgeProps) {
  const contextDrills = getContextDrills(lesson, viewContext, selectedPlayer);
  if (contextDrills.length === 0) return null;

  const tooltipContent =
    viewContext === "coach" ? (
      (() => {
        const groups = buildCoachGroups(lesson, contextDrills);
        const visible = groups.slice(0, MAX_TOOLTIP_ITEMS);
        const remaining = groups.length - visible.length;

        return (
          <div className="max-w-xs space-y-1">
            {visible.map((group) => (
              <p key={group.key} className="text-xs">
                <strong>{group.label}:</strong>{" "}
                {group.titles.length > 0
                  ? group.titles.join(", ")
                  : "No drills recorded"}
              </p>
            ))}
            {remaining > 0 && <p className="text-xs">+{remaining} more groups</p>}
          </div>
        );
      })()
    ) : (
      (() => {
        const titles = contextDrills.map((drill) => drill.title);
        const visible = titles.slice(0, MAX_TOOLTIP_ITEMS);
        const remaining = titles.length - visible.length;

        return (
          <div className="max-w-xs space-y-1">
            {visible.length > 0 ? (
              visible.map((title, idx) => (
                <p key={`${title}-${idx}`} className="text-xs">
                  {title}
                </p>
              ))
            ) : (
              <p className="text-xs">No drills recorded</p>
            )}
            {remaining > 0 && <p className="text-xs">+{remaining} more drills</p>}
          </div>
        );
      })()
    );

  return (
    <Tooltip content={tooltipContent} placement="top-start">
      <Chip
        size="sm"
        variant="flat"
        startContent={<ListChecks className="h-3.5 w-3.5" />}
        classNames={{
          base: "cursor-default bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
          content: "text-xs",
        }}
      >
        Drills x{contextDrills.length}
      </Chip>
    </Tooltip>
  );
}

