"use client";

import { Chip } from "@heroui/react";
import { Wrench } from "lucide-react";

import { LessonMechanicData } from "@/db/queries/lessons/lessonQueries.types";

import { LESSON_TYPE_CONFIG } from "../lessonCard/lessonTypeConfig";
import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  mechanics: LessonMechanicData[];
}

function MechanicCard({ mechanic }: { mechanic: LessonMechanicData }) {
  const cfg = LESSON_TYPE_CONFIG[mechanic.type];

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {mechanic.name}
        </h4>
        <Chip
          size="sm"
          variant="flat"
          classNames={{
            base: cfg.badgeBg,
            content: `text-xs ${cfg.badgeText}`,
          }}
        >
          {cfg.label}
        </Chip>
      </div>

      {mechanic.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {mechanic.description}
        </p>
      )}

      {mechanic.tags && mechanic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {mechanic.tags.map((tag, i) => (
            <Chip
              key={i}
              size="sm"
              variant="flat"
              classNames={{
                base: "bg-zinc-200 dark:bg-zinc-700",
                content: "text-xs text-zinc-600 dark:text-zinc-400",
              }}
            >
              {tag}
            </Chip>
          ))}
        </div>
      )}

      {mechanic.notes && (
        <div className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-800">
          <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
            {mechanic.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export function MechanicsSection({ mechanics }: Props) {
  if (mechanics.length === 0) {
    return (
      <LessonViewerSection
        title="Mechanics"
        icon={<Wrench className="h-4 w-4" />}
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No mechanics recorded for this lesson.
        </p>
      </LessonViewerSection>
    );
  }

  return (
    <LessonViewerSection
      title={`Mechanics (${mechanics.length})`}
      icon={<Wrench className="h-4 w-4" />}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mechanics.map((mechanic) => (
          <MechanicCard key={mechanic.id} mechanic={mechanic} />
        ))}
      </div>
    </LessonViewerSection>
  );
}
