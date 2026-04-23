"use client";

import { useMemo, useState } from "react";

import { Button, Input, ScrollShadow, Select, SelectItem } from "@heroui/react";

import { LessonCardData } from "@ams/db/queries/lessons/lessonQueries.types";

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

const LESSON_TYPE_LABELS: Record<LessonCardData["lessonType"], string> = {
  pitching: "Pitching",
  hitting: "Hitting",
  fielding: "Fielding",
  catching: "Catching",
  strength: "Strength",
};

function getLessonDateKey(value: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const [coachFilter, setCoachFilter] = useState("all");
  const [lessonTypeFilter, setLessonTypeFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const coachOptions = useMemo(() => {
    const unique = new Map<string, string>();

    for (const lesson of lessons) {
      if (!lesson.coach?.id) continue;
      unique.set(
        lesson.coach.id,
        lesson.coach.name?.trim() || lesson.coach.email || "Unknown coach"
      );
    }

    return Array.from(unique.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [lessons]);

  const lessonTypeOptions = useMemo(() => {
    return Array.from(new Set(lessons.map((lesson) => lesson.lessonType))).map(
      (type) => ({
        id: type,
        label: LESSON_TYPE_LABELS[type],
      })
    );
  }, [lessons]);

  const coachSelectItems = useMemo(
    () => [{ id: "all", label: "All coaches" }, ...coachOptions],
    [coachOptions]
  );

  const lessonTypeSelectItems = useMemo(
    () => [{ id: "all", label: "All lesson types" }, ...lessonTypeOptions],
    [lessonTypeOptions]
  );

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (coachFilter !== "all" && lesson.coach.id !== coachFilter) {
        return false;
      }

      if (
        lessonTypeFilter !== "all" &&
        lesson.lessonType !== lessonTypeFilter
      ) {
        return false;
      }

      if (!startDateFilter && !endDateFilter) {
        return true;
      }

      const lessonDateKey = getLessonDateKey(lesson.lessonDate);
      if (!lessonDateKey) {
        return false;
      }

      if (startDateFilter && lessonDateKey < startDateFilter) {
        return false;
      }

      if (endDateFilter && lessonDateKey > endDateFilter) {
        return false;
      }

      return true;
    });
  }, [coachFilter, endDateFilter, lessonTypeFilter, lessons, startDateFilter]);

  const hasActiveFilters =
    coachFilter !== "all" ||
    lessonTypeFilter !== "all" ||
    !!startDateFilter ||
    !!endDateFilter;

  const showEmptyState = filteredLessons.length === 0;

  if (lessons.length === 0 && !hasActiveFilters) {
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
    <div className={className}>
      <div className="mb-3 rounded-xl border border-zinc-200/70 bg-white/70 p-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Coach"
            items={coachSelectItems}
            selectedKeys={[coachFilter]}
            onSelectionChange={(keys) => {
              const next =
                keys === "all" ? "all" : String(Array.from(keys)[0] ?? "all");
              setCoachFilter(next);
            }}
          >
            {(item) => (
              <SelectItem key={item.id} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </Select>

          <Select
            label="Lesson Type"
            items={lessonTypeSelectItems}
            selectedKeys={[lessonTypeFilter]}
            onSelectionChange={(keys) => {
              const next =
                keys === "all" ? "all" : String(Array.from(keys)[0] ?? "all");
              setLessonTypeFilter(next);
            }}
          >
            {(item) => (
              <SelectItem key={item.id} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </Select>

          <Input
            type="date"
            label="From Date"
            value={startDateFilter}
            onValueChange={setStartDateFilter}
          />

          <Input
            type="date"
            label="To Date"
            value={endDateFilter}
            onValueChange={setEndDateFilter}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredLessons.length} of {lessons.length} lessons
          </p>

          <Button
            size="sm"
            variant="flat"
            onPress={() => {
              setCoachFilter("all");
              setLessonTypeFilter("all");
              setStartDateFilter("");
              setEndDateFilter("");
            }}
            isDisabled={!hasActiveFilters}
          >
            Clear filters
          </Button>
        </div>
      </div>

      {showEmptyState ? (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg
              className="h-7 w-7 text-zinc-400 dark:text-zinc-500"
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
            {lessons.length === 0
              ? emptyMessage
              : "No lessons match the selected filters"}
          </p>
        </div>
      ) : (
        <ScrollShadow className={maxHeight}>
          <div className="flex flex-col gap-3 p-4 pb-4 sm:gap-4">
            {filteredLessons.map((lesson) => (
              <ClickableLessonCard
                key={lesson.id}
                lesson={lesson}
                viewContext={viewContext}
                playerId={playerId}
                href={
                  playerId
                    ? `${baseHref}/${lesson.id}?playerId=${encodeURIComponent(playerId)}`
                    : `${baseHref}/${lesson.id}`
                }
                onClick={onLessonClick}
              />
            ))}
          </div>
        </ScrollShadow>
      )}
    </div>
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
