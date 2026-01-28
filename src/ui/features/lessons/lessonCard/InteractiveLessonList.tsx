"use client";

import { ScrollShadow } from "@heroui/react";

import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

import { ClickableLessonCard } from "./ClickableLessonCard";
import { LessonCardSkeleton } from "./LessonCardSkeleton";
import type { ViewContext } from "./types";

interface InteractiveLessonListProps {
  lessons: LessonCardData[];
  viewContext: ViewContext;
  playerId?: string;
  /** Base URL for lesson links. Lesson ID will be appended. */
  baseHref?: string;
  /** Custom click handler for lessons */
  onLessonClick?: (lessonId: string) => void;
  emptyMessage?: string;
  maxHeight?: string;
  className?: string;
}

export function InteractiveLessonList({
  lessons,
  viewContext,
  playerId,
  baseHref = "/lessons",
  onLessonClick,
  emptyMessage = "No lessons found",
  maxHeight = "max-h-[calc(100vh-200px)]",
  className = "",
}: InteractiveLessonListProps) {
  if (lessons.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center px-4 py-16 text-center ${className} `}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ScrollShadow hideScrollBar className={`${maxHeight} ${className}`}>
      <div className="flex flex-col gap-3 p-4 pb-4 sm:gap-4">
        {lessons.map((lesson) => (
          <ClickableLessonCard
            key={lesson.id}
            lesson={lesson}
            viewContext={viewContext}
            playerId={playerId}
            href={`${baseHref}/${lesson.id}`}
            onClick={onLessonClick}
          />
        ))}
      </div>
    </ScrollShadow>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

interface InteractiveLessonListSkeletonProps {
  count?: number;
  maxHeight?: string;
  className?: string;
}

export function InteractiveLessonListSkeleton({
  count = 5,
  maxHeight = "max-h-[calc(100vh-200px)]",
  className = "",
}: InteractiveLessonListSkeletonProps) {
  return (
    <ScrollShadow hideScrollBar className={`${maxHeight} ${className}`}>
      <div className="flex flex-col gap-3 pb-4 sm:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <LessonCardSkeleton key={i} />
        ))}
      </div>
    </ScrollShadow>
  );
}

export default InteractiveLessonList;
