import { ScrollShadow } from "@heroui/react";
import { CalendarDays } from "lucide-react";

import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

import { LessonCard } from "./LessonCard";
import type { ViewContext } from "./types";

interface LessonCardListProps {
  lessons: LessonCardData[];
  viewContext: ViewContext;
  playerId?: string;
  emptyMessage?: string;
  /** Maximum height of the scrollable container */
  maxHeight?: string;
  /** Additional class names for the container */
  className?: string;
}

export function LessonCardList({
  lessons,
  viewContext,
  playerId,
  emptyMessage = "No lessons found",
  maxHeight = "max-h-[calc(100vh-200px)]",
  className = "",
}: LessonCardListProps) {
  if (lessons.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center px-4 py-16 text-center ${className} `}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <CalendarDays className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ScrollShadow hideScrollBar className={`${maxHeight} ${className}`}>
      <div className="flex flex-col gap-3 pb-4 sm:gap-4">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            viewContext={viewContext}
            playerId={playerId}
          />
        ))}
      </div>
    </ScrollShadow>
  );
}

export default LessonCardList;
