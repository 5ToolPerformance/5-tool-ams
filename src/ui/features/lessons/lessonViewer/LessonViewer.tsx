"use client";

import { Divider } from "@heroui/react";

import { LESSON_TYPE_CONFIG } from "../lessonCard/lessonTypeConfig";
import { CoachSection } from "./CoachSection";
import { LessonViewerHeader } from "./LessonViewerHeader";
import { NotesSection } from "./NotesSection";
import { PlayerLessonDetailsPanel } from "./PlayerLessonDetailsPanel";
import { PlayersSection } from "./PlayersSection";
import type { LessonViewerProps } from "./types";

export function LessonViewer({
  lesson,
  viewContext,
  playerId,
  className = "",
}: LessonViewerProps) {
  const cfg = LESSON_TYPE_CONFIG[lesson.lessonType];
  const defaultSelectedPlayerId = lesson.players.some(
    (player) => player.id === playerId
  )
    ? playerId
    : lesson.players[0]?.id;
  const hasNotes = Boolean(lesson.notes?.trim());
  const showTabs = lesson.players.length > 1;
  const showGlobalPlayersSummary = lesson.players.length > 1;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
    >
      <div className={`h-1.5 ${cfg.accentBg}`} />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <LessonViewerHeader lesson={lesson} />

        <Divider className="dark:bg-zinc-800" />

        {viewContext === "player" && <CoachSection coach={lesson.coach} />}

        {showGlobalPlayersSummary && (
          <>
            <PlayersSection players={lesson.players} />
            <Divider className="dark:bg-zinc-800" />
          </>
        )}

        {hasNotes && (
          <>
            <NotesSection notes={lesson.notes} />
            <Divider className="dark:bg-zinc-800" />
          </>
        )}

        {!hasNotes && <Divider className="dark:bg-zinc-800" />}

        <PlayerLessonDetailsPanel
          lesson={lesson}
          players={lesson.players}
          showTabs={showTabs}
          defaultSelectedPlayerId={defaultSelectedPlayerId}
        />
      </div>
    </div>
  );
}
