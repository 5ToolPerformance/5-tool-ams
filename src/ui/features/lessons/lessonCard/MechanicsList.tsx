"use client";

import { Chip } from "@heroui/react";

import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

interface Props {
  mechanics: LessonCardData["mechanics"];
  maxVisible?: number;
}

export function MechanicsList({ mechanics, maxVisible = 4 }: Props) {
  const visible = mechanics.slice(0, maxVisible);
  const remaining = mechanics.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((m) => (
        <Chip
          key={m.id}
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
            content: "text-xs px-1",
          }}
        >
          {m.name}
        </Chip>
      ))}
      {remaining > 0 && (
        <Chip
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
            content: "text-xs px-1",
          }}
        >
          +{remaining} more
        </Chip>
      )}
    </div>
  );
}
