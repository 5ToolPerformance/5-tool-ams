"use client";

import { Divider } from "@heroui/react";

import { LESSON_TYPE_CONFIG } from "../lessonCard/lessonTypeConfig";
import { CoachSection } from "./CoachSection";
import { LessonViewerHeader } from "./LessonViewerHeader";
import { MechanicsSection } from "./MechanicsSection";
import { NotesSection } from "./NotesSection";
import { PlayersSection } from "./PlayersSection";
import type { LessonViewerProps } from "./types";

export function LessonViewer({
  lesson,
  viewContext,
  className = "",
}: LessonViewerProps) {
  const cfg = LESSON_TYPE_CONFIG[lesson.lessonType];

  return (
    <div
      className={`overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
    >
      <div className={`h-1.5 ${cfg.accentBg}`} />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <LessonViewerHeader lesson={lesson} />

        <Divider className="dark:bg-zinc-800" />

        {viewContext === "player" && <CoachSection coach={lesson.coach} />}

        <PlayersSection players={lesson.players} />

        <Divider className="dark:bg-zinc-800" />

        <MechanicsSection mechanics={lesson.mechanics} />

        <Divider className="dark:bg-zinc-800" />

        <NotesSection notes={lesson.notes} />
      </div>
    </div>
  );
}
