import { ReactNode } from "react";

import { Chip, Tooltip } from "@heroui/react";
import { Paperclip, Video } from "lucide-react";

import {
  LessonCardData,
  LessonPlayerData,
} from "@ams/db/queries/lessons/lessonQueries.types";

import { countStrengthMetrics } from "./lessonCard.helpers";
import type { ViewContext } from "./types";

interface LessonPlayerCardsProps {
  lesson: LessonCardData;
  players: LessonPlayerData[];
  viewContext: ViewContext;
  totalPlayers: number;
}

function getPlayerDrills(
  lesson: LessonCardData,
  player: LessonPlayerData
): LessonCardData["drills"] {
  if (!player.lessonPlayerId) return [];
  return lesson.drills.filter(
    (drill) => drill.lessonPlayerId === player.lessonPlayerId
  );
}

function getPlayerMechanics(lesson: LessonCardData, player: LessonPlayerData) {
  return lesson.mechanics.filter((mechanic) => mechanic.playerId === player.id);
}

function getPlayerEvidenceCounts(player: LessonPlayerData) {
  const videos = player.attachments.filter(
    (a) => a.type === "file_video"
  ).length;
  return {
    videos,
    attachments: player.attachments.length - videos,
  };
}

function HoverListChip({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;

  const visibleItems = items.slice(0, 8);
  const remaining = items.length - visibleItems.length;

  return (
    <Tooltip
      placement="top-start"
      content={
        <div className="max-w-xs space-y-1">
          {visibleItems.map((item, idx) => (
            <p key={`${item}-${idx}`} className="text-xs">
              {item}
            </p>
          ))}
          {remaining > 0 && <p className="text-xs">+{remaining} more</p>}
        </div>
      }
    >
      <Chip
        size="sm"
        variant="flat"
        classNames={{
          base: "cursor-default bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
          content: "text-[11px]",
        }}
      >
        {label} x{items.length}
      </Chip>
    </Tooltip>
  );
}

function PresenceChip({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <Tooltip content={label} placement="top">
      <Chip
        size="sm"
        variant="flat"
        startContent={icon}
        classNames={{
          base: "cursor-default bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
          content: "text-[11px]",
        }}
      >
        {label}
      </Chip>
    </Tooltip>
  );
}

function PlayerSpecificSummary({
  lesson,
  player,
}: {
  lesson: LessonCardData;
  player: LessonPlayerData;
}) {
  if (lesson.lessonType === "pitching") {
    const pitching = player.lessonSpecific.pitching;
    if (!pitching?.summary && !pitching?.focus) return null;

    return (
      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
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

  if (lesson.lessonType === "strength") {
    const metricCount = countStrengthMetrics(
      player.lessonSpecific.strength?.tsIso
    );
    if (metricCount === 0) return null;

    return (
      <Chip
        size="sm"
        variant="flat"
        classNames={{
          base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
          content: "text-xs",
        }}
      >
        TS ISO: {metricCount} metrics
      </Chip>
    );
  }

  return null;
}

export function LessonPlayerCards({
  lesson,
  players,
  viewContext,
  totalPlayers,
}: LessonPlayerCardsProps) {
  if (players.length === 0) return null;

  const maxVisiblePlayers = viewContext === "coach" ? 3 : 1;
  const visiblePlayers = players.slice(0, maxVisiblePlayers);
  const remainingPlayers = Math.max(0, totalPlayers - visiblePlayers.length);

  return (
    <div className="space-y-2">
      {remainingPlayers > 0 && (
        <div className="flex justify-start">
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
              content: "text-[11px]",
            }}
          >
            +{remainingPlayers} more players
          </Chip>
        </div>
      )}

      <div
        className={
          viewContext === "coach"
            ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3"
            : "grid grid-cols-1 gap-3"
        }
      >
        {visiblePlayers.map((player) => {
          const playerDrills = getPlayerDrills(lesson, player);
          const playerMechanics = getPlayerMechanics(lesson, player);
          const { videos, attachments } = getPlayerEvidenceCounts(player);

          return (
            <div
              key={player.id}
              className={
                viewContext === "coach"
                  ? "rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                  : "w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
              }
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {player.firstName} {player.lastName}
                </p>
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                    content: "text-[11px]",
                  }}
                >
                  {player.position}
                </Chip>
              </div>

              {player.notes && (
                <p className="mb-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {player.notes}
                </p>
              )}

              <PlayerSpecificSummary lesson={lesson} player={player} />

              <div className="mt-2 flex flex-wrap gap-2">
                <HoverListChip
                  label="Mechanics"
                  items={playerMechanics.map((mechanic) => mechanic.name)}
                />
                <HoverListChip
                  label="Drills"
                  items={playerDrills.map((drill) => drill.title)}
                />
                {videos > 0 && (
                  <PresenceChip
                    label="Videos"
                    icon={<Video className="h-3.5 w-3.5" />}
                  />
                )}
                {attachments > 0 && (
                  <PresenceChip
                    label="Attachments"
                    icon={<Paperclip className="h-3.5 w-3.5" />}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
