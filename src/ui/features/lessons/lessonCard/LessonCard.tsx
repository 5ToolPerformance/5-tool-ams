import { Chip, Divider } from "@heroui/react";
import { CalendarDays, Clock, User, Users } from "lucide-react";

import { CoachDisplay } from "./CoachDisplay";
import { LessonTypeBadge } from "./LessonTypeBadge";
import { LessonTypeIcon } from "./LessonTypeIcon";
import { MechanicsList } from "./MechanicsList";
import { PlayerAvatars } from "./PlayerAvatars";
import {
  formatLessonDate,
  formatLessonTime,
  getRelativeTime,
} from "./lessonFormatters";
import { LESSON_TYPE_CONFIG } from "./lessonTypeConfig";
import type { LessonCardProps } from "./types";

export function LessonCard({
  lesson,
  viewContext,
  className = "",
}: LessonCardProps) {
  const cfg = LESSON_TYPE_CONFIG[lesson.lessonType];

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-l-4 border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-zinc-950/20 ${cfg.accentBorder} ${className}`}
    >
      <div className="px-4 pt-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 gap-3">
            <LessonTypeIcon lessonType={lesson.lessonType} />
            <div className="min-w-0">
              <LessonTypeBadge lessonType={lesson.lessonType} />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {getRelativeTime(lesson.lessonDate)}
              </p>
            </div>
          </div>

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
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3 sm:space-y-4 sm:pb-5 sm:pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {viewContext === "coach" ? (
            <>
              <Users className="h-4 w-4 flex-shrink-0 text-zinc-400 dark:text-zinc-500" />
              <PlayerAvatars players={lesson.players} />
            </>
          ) : (
            <>
              <User className="h-4 w-4 flex-shrink-0 text-zinc-400 dark:text-zinc-500" />
              <CoachDisplay coach={lesson.coach} />
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {formatLessonDate(lesson.lessonDate)}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {formatLessonTime(lesson.lessonDate)}
            </span>
          </span>
        </div>

        {lesson.notes && (
          <p className="line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
            {lesson.notes}
          </p>
        )}

        {lesson.mechanics.length > 0 && (
          <>
            <Divider />
            <MechanicsList mechanics={lesson.mechanics} />
          </>
        )}
      </div>
    </div>
  );
}
