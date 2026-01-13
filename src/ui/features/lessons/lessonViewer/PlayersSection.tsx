"use client";

import { Avatar, Chip } from "@heroui/react";
import { Users } from "lucide-react";

import { LessonPlayerData } from "@/db/queries/lessons/lessonQueries.types";

import { getPlayerInitials } from "../lessonCard/lessonFormatters";
import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  players: LessonPlayerData[];
}

function PlayerCard({ player }: { player: LessonPlayerData }) {
  return (
    <div className="flex gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <Avatar
        src={player.profilePictureUrl ?? undefined}
        name={getPlayerInitials(player)}
        size="lg"
        classNames={{
          base: "ring-2 ring-white dark:ring-zinc-900 flex-shrink-0",
          name: "text-sm font-semibold",
        }}
      />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {player.firstName} {player.lastName}
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-zinc-200 dark:bg-zinc-700",
              content: "text-xs text-zinc-700 dark:text-zinc-300",
            }}
          >
            {player.position}
          </Chip>
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-zinc-200 dark:bg-zinc-700",
              content: "text-xs text-zinc-700 dark:text-zinc-300",
            }}
          >
            Throws: {player.throws}
          </Chip>
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-zinc-200 dark:bg-zinc-700",
              content: "text-xs text-zinc-700 dark:text-zinc-300",
            }}
          >
            Hits: {player.hits}
          </Chip>
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: player.sport === "baseball"
                ? "bg-blue-100 dark:bg-blue-900/40"
                : "bg-pink-100 dark:bg-pink-900/40",
              content: player.sport === "baseball"
                ? "text-xs text-blue-700 dark:text-blue-300"
                : "text-xs text-pink-700 dark:text-pink-300",
            }}
          >
            {player.sport === "baseball" ? "Baseball" : "Softball"}
          </Chip>
        </div>
        {player.notes && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {player.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export function PlayersSection({ players }: Props) {
  if (players.length === 0) {
    return (
      <LessonViewerSection title="Players" icon={<Users className="h-4 w-4" />}>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No players recorded for this lesson.
        </p>
      </LessonViewerSection>
    );
  }

  return (
    <LessonViewerSection
      title={`Players (${players.length})`}
      icon={<Users className="h-4 w-4" />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </LessonViewerSection>
  );
}
