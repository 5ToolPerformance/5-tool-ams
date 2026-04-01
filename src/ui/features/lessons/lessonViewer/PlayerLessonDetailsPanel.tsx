"use client";

import { ReactNode } from "react";

import { Divider, Tab, Tabs } from "@heroui/react";

import {
  LessonCardData,
  LessonPlayerData,
} from "@/db/queries/lessons/lessonQueries.types";

import { countStrengthMetrics } from "../lessonCard/lessonCard.helpers";
import { AttachmentsSection } from "./AttachmentsSection";
import { DrillsSection } from "./DrillsSection";
import { FatigueSection } from "./FatigueSection";
import { LessonSpecificSection } from "./LessonSpecificSection";
import { MechanicsSection } from "./MechanicsSection";
import { RoutineSections } from "./RoutineSections";

interface Props {
  lesson: LessonCardData;
  players: LessonPlayerData[];
  showTabs: boolean;
  defaultSelectedPlayerId?: string;
}

function PlayerLessonDetailContent({
  lesson,
  player,
}: {
  lesson: LessonCardData;
  player: LessonPlayerData;
}) {
  const mechanics = lesson.mechanics.filter(
    (mechanic) => mechanic.playerId === player.id
  );
  const drills = player.lessonPlayerId
    ? lesson.drills.filter(
        (drill) => drill.lessonPlayerId === player.lessonPlayerId
      )
    : [];
  const routineMechanicIds = new Set(
    player.appliedRoutines.flatMap((routine) =>
      routine.sourceRoutineDocument.mechanics.map((mechanic) => mechanic.mechanicId)
    )
  );
  const routineDrillIds = new Set(
    player.appliedRoutines.flatMap((routine) =>
      routine.sourceRoutineDocument.blocks.flatMap((block) =>
        block.drills.map((drill) => drill.drillId)
      )
    )
  );
  const extraMechanics = mechanics.filter(
    (mechanic) => !routineMechanicIds.has(mechanic.mechanicId)
  );
  const extraDrills = drills.filter((drill) => !routineDrillIds.has(drill.drillId));
  const sections: ReactNode[] = [];

  if (player.fatigueData.length > 0) {
    sections.push(
      <FatigueSection key="fatigue" fatigueData={player.fatigueData} />
    );
  }

  const hasPitchingSpecific =
    lesson.lessonType === "pitching" &&
    Boolean(
      player.lessonSpecific.pitching?.summary ||
        player.lessonSpecific.pitching?.focus
    );
  const strengthTsIso = player.lessonSpecific.strength?.tsIso;
  const hasStrengthSpecific =
    lesson.lessonType === "strength" &&
    Boolean(strengthTsIso && countStrengthMetrics(strengthTsIso) > 0);

  if (hasPitchingSpecific || hasStrengthSpecific) {
    sections.push(
      <LessonSpecificSection
        key="lesson-specific"
        lessonType={lesson.lessonType}
        player={player}
      />
    );
  }

  if (player.appliedRoutines.length > 0) {
    sections.push(
      <RoutineSections
        key="routines"
        routines={player.appliedRoutines}
        mechanics={mechanics}
        drills={drills}
      />
    );
  }

  if (extraMechanics.length > 0) {
    sections.push(<MechanicsSection key="mechanics" mechanics={extraMechanics} />);
  }

  if (extraDrills.length > 0) {
    sections.push(<DrillsSection key="drills" drills={extraDrills} />);
  }

  if (player.attachments.length > 0) {
    sections.push(
      <AttachmentsSection key="attachments" attachments={player.attachments} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {player.firstName} {player.lastName}
        </h3>
        <Divider className="dark:bg-zinc-800" />
        {player.notes && (
          <div>
            <h4 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Player Notes
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {player.notes}
            </p>
          </div>
        )}
      </div>
      {sections.map((section, index) => (
        <div key={index}>
          <Divider className="dark:bg-zinc-800" />
          {section}
        </div>
      ))}
    </div>
  );
}

export function PlayerLessonDetailsPanel({
  lesson,
  players,
  showTabs,
  defaultSelectedPlayerId,
}: Props) {
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
      defaultSelectedKey={defaultSelectedPlayerId}
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
