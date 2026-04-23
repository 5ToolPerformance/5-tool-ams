"use client";

import { Chip } from "@heroui/react";
import { FlaskConical } from "lucide-react";

import {
  LessonCardData,
  LessonPlayerData,
} from "@ams/db/queries/lessons/lessonQueries.types";

import { countStrengthMetrics } from "../lessonCard/lessonCard.helpers";
import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  lessonType: LessonCardData["lessonType"];
  player: LessonPlayerData;
}

function formatDbLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function LessonSpecificSection({ lessonType, player }: Props) {
  if (lessonType === "pitching") {
    const pitching = player.lessonSpecific.pitching;
    if (!pitching?.summary && !pitching?.focus) {
      return null;
    }

    return (
      <LessonViewerSection
        title="Lesson Specific"
        icon={<FlaskConical className="h-4 w-4" />}
      >
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          {pitching.summary && (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>Summary:</strong> {pitching.summary}
            </p>
          )}
          {pitching.focus && (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>Focus:</strong> {formatDbLabel(pitching.focus)}
            </p>
          )}
        </div>
      </LessonViewerSection>
    );
  }

  if (lessonType === "strength") {
    const tsIso = player.lessonSpecific.strength?.tsIso;
    const metricCount = countStrengthMetrics(tsIso);
    if (!tsIso || metricCount === 0) {
      return null;
    }

    return (
      <LessonViewerSection
        title="Lesson Specific"
        icon={<FlaskConical className="h-4 w-4" />}
      >
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: "bg-zinc-100 dark:bg-zinc-700",
              content: "text-xs",
            }}
          >
            TS ISO: {metricCount} metrics
          </Chip>
        </div>
      </LessonViewerSection>
    );
  }

  return null;
}
