"use client";

import { Avatar, AvatarGroup, Tooltip } from "@heroui/react";

import { LessonPlayerData } from "@/db/queries/lessons/lessonQueries.types";

import { getPlayerInitials } from "./lessonFormatters";

interface Props {
  players: LessonPlayerData[];
  maxVisible?: number;
}

export function PlayerAvatars({ players, maxVisible = 4 }: Props) {
  const visiblePlayers = players.slice(0, maxVisible);

  if (players.length === 1) {
    const player = players[0];
    return (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          src={player.profilePictureUrl ?? undefined}
          name={getPlayerInitials(player)}
          size="sm"
          classNames={{
            base: "ring-2 ring-white dark:ring-zinc-900 flex-shrink-0",
            name: "text-xs font-semibold",
          }}
        />
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {player.firstName} {player.lastName}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <AvatarGroup
        max={maxVisible}
        total={players.length}
        size="sm"
        renderCount={(count) => (
          <Tooltip content={`${count} more players`}>
            <Avatar
              name={`+${count}`}
              size="sm"
              classNames={{
                base: "ring-2 ring-white dark:ring-zinc-900 bg-zinc-200 dark:bg-zinc-700",
                name: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
              }}
            />
          </Tooltip>
        )}
      >
        {visiblePlayers.map((player) => (
          <Tooltip
            key={player.id}
            content={`${player.firstName} ${player.lastName}`}
          >
            <Avatar
              src={player.profilePictureUrl ?? undefined}
              name={getPlayerInitials(player)}
              size="sm"
              classNames={{
                base: "ring-2 ring-white dark:ring-zinc-900",
                name: "text-xs font-semibold",
              }}
            />
          </Tooltip>
        ))}
      </AvatarGroup>

      <span className="flex-shrink-0 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
        {players.length} players
      </span>
    </div>
  );
}
