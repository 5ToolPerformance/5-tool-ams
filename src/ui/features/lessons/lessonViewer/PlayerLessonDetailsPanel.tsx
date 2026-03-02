"use client";

import { Avatar, Chip, Divider, Tab, Tabs } from "@heroui/react";

import {
  LessonCardData,
  LessonPlayerData,
} from "@/db/queries/lessons/lessonQueries.types";

import { getPlayerInitials } from "../lessonCard/lessonFormatters";
import { AttachmentsSection } from "./AttachmentsSection";
import { DrillsSection } from "./DrillsSection";
import { FatigueSection } from "./FatigueSection";
import { LessonSpecificSection } from "./LessonSpecificSection";
import { MechanicsSection } from "./MechanicsSection";

interface Props {
  lesson: LessonCardData;
  players: LessonPlayerData[];
  showTabs: boolean;
}

function PlayerIdentityCard({ player }: { player: LessonPlayerData }) {
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
          <Chip size="sm" variant="flat">
            {player.position}
          </Chip>
          <Chip size="sm" variant="flat">
            Throws: {player.throws}
          </Chip>
          <Chip size="sm" variant="flat">
            Hits: {player.hits}
          </Chip>
          <Chip size="sm" variant="flat">
            {player.sport}
          </Chip>
        </div>
        {player.notes && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{player.notes}</p>
        )}
      </div>
    </div>
  );
}

function PlayerLessonDetailContent({
  lesson,
  player,
}: {
  lesson: LessonCardData;
  player: LessonPlayerData;
}) {
  const mechanics = lesson.mechanics.filter((mechanic) => mechanic.playerId === player.id);
  const drills = player.lessonPlayerId
    ? lesson.drills.filter((drill) => drill.lessonPlayerId === player.lessonPlayerId)
    : [];

  return (
    <div className="space-y-6">
      <PlayerIdentityCard player={player} />

      <Divider className="dark:bg-zinc-800" />
      <FatigueSection fatigueData={player.fatigueData} />

      <Divider className="dark:bg-zinc-800" />
      <LessonSpecificSection lessonType={lesson.lessonType} player={player} />

      <Divider className="dark:bg-zinc-800" />
      <MechanicsSection mechanics={mechanics} />

      <Divider className="dark:bg-zinc-800" />
      <DrillsSection drills={drills} />

      <Divider className="dark:bg-zinc-800" />
      <AttachmentsSection attachments={player.attachments} />
    </div>
  );
}

export function PlayerLessonDetailsPanel({ lesson, players, showTabs }: Props) {
  if (players.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No player-specific lesson information available.
      </p>
    );
  }

  if (!showTabs) {
    return <PlayerLessonDetailContent lesson={lesson} player={players[0]} />;
  }

  return (
    <Tabs
      aria-label="Lesson players"
      variant="underlined"
      classNames={{
        tabList: "gap-1 overflow-x-auto",
      }}
    >
      {players.map((player) => (
        <Tab
          key={player.id}
          title={
            <span className="max-w-[180px] truncate">
              {player.firstName} {player.lastName}
            </span>
          }
        >
          <div className="pt-4">
            <PlayerLessonDetailContent lesson={lesson} player={player} />
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}
