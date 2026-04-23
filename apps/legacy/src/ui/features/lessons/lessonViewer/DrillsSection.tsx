"use client";

import { Chip } from "@heroui/react";
import { ListChecks } from "lucide-react";

import { LessonDrillData } from "@/db/queries/lessons/lessonQueries.types";

import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  drills: LessonDrillData[];
}

function formatDbLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DrillsSection({ drills }: Props) {
  if (drills.length === 0) {
    return null;
  }

  return (
    <LessonViewerSection
      title={`Drills (${drills.length})`}
      icon={<ListChecks className="h-4 w-4" />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {drills.map((drill) => (
          <div
            key={drill.id}
            className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {drill.title}
              </h4>
              <Chip
                size="sm"
                variant="flat"
                classNames={{
                  base: "bg-zinc-100 dark:bg-zinc-700",
                  content: "text-xs",
                }}
              >
                {formatDbLabel(drill.discipline)}
              </Chip>
            </div>
            {drill.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {drill.description}
              </p>
            )}
            {drill.notes && (
              <p className="rounded-md bg-zinc-100 p-2 text-sm italic text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {drill.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </LessonViewerSection>
  );
}
