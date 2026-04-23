"use client";

import { Avatar } from "@heroui/react";

import { LessonCoachData } from "@/db/queries/lessons/lessonQueries.types";

import { getCoachInitials } from "./lessonFormatters";

interface Props {
  coach: LessonCoachData;
}

export function CoachDisplay({ coach }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar
        src={coach.image ?? undefined}
        name={getCoachInitials(coach)}
        size="sm"
        classNames={{
          base: "ring-2 ring-white dark:ring-zinc-900 flex-shrink-0",
          name: "text-xs font-semibold",
        }}
      />
      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {coach.name ?? "Unknown Coach"}
      </span>
    </div>
  );
}
