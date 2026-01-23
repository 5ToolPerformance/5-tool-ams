"use client";

import Link from "next/link";

import { Chip } from "@heroui/react";
import { CalendarDays, Clock, Pencil } from "lucide-react";

import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

import {
  formatLessonDate,
  formatLessonTime,
  getRelativeTime,
} from "../lessonCard/lessonFormatters";
import { LESSON_TYPE_CONFIG } from "../lessonCard/lessonTypeConfig";

interface Props {
  lesson: LessonCardData;
}

export function LessonViewerHeader({ lesson }: Props) {
  const cfg = LESSON_TYPE_CONFIG[lesson.lessonType];
  const Icon = cfg.icon;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${cfg.iconBg}`}
          >
            <Icon className={`h-6 w-6 ${cfg.iconText}`} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                {cfg.label} Lesson
              </h1>
              {lesson.isLegacy && (
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-zinc-100 dark:bg-zinc-800",
                    content: "text-zinc-600 dark:text-zinc-400",
                  }}
                >
                  Legacy
                </Chip>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {getRelativeTime(lesson.lessonDate)}
            </p>
          </div>
        </div>

        <Link
          href={`/lessons/${lesson.id}/edit`}
          aria-label="Edit lesson"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-950"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
          <CalendarDays className="h-4 w-4 flex-shrink-0" />
          <span>{formatLessonDate(lesson.lessonDate)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>{formatLessonTime(lesson.lessonDate)}</span>
        </div>
      </div>
    </div>
  );
}
