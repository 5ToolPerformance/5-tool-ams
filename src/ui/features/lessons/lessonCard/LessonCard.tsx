import { Chip, Divider } from "@heroui/react";
import { User, Users } from "lucide-react";

import { CoachDisplay } from "./CoachDisplay";
import { LessonDrillsBadge } from "./LessonDrillsBadge";
import { LessonEvidenceChips } from "./LessonEvidenceChips";
import { LessonFatigueChips } from "./LessonFatigueChips";
import { LessonPlayerCards } from "./LessonPlayerCards";
import { LessonTypeBadge } from "./LessonTypeBadge";
import { LessonTypeIcon } from "./LessonTypeIcon";
import { MechanicsList } from "./MechanicsList";
import { getPlayersForContext, getSelectedPlayer } from "./lessonCard.helpers";
import { PlayerAvatars } from "./PlayerAvatars";
import { formatLessonDate } from "./lessonFormatters";
import { LESSON_TYPE_CONFIG } from "./lessonTypeConfig";
import type { LessonCardProps } from "./types";

export function LessonCard({
  lesson,
  viewContext,
  playerId,
  className = "",
}: LessonCardProps) {
  const cfg = LESSON_TYPE_CONFIG[lesson.lessonType];

  const selectedPlayer = getSelectedPlayer(lesson, viewContext, playerId);
  const playersForContext = getPlayersForContext(
    lesson,
    viewContext,
    selectedPlayer
  );
  const contextualAttachments = playersForContext.flatMap(
    (player) => player.attachments
  );
  const videoCount = contextualAttachments.filter(
    (attachment) => attachment.type === "file_video"
  ).length;
  const attachmentCount = contextualAttachments.length - videoCount;

  const notesToShow =
    lesson.notes;

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-l-4 border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-zinc-950/20 ${cfg.accentBorder} ${className}`}
    >
      <div className="px-4 pt-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 gap-3">
            <LessonTypeIcon lessonType={lesson.lessonType} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <LessonTypeBadge lessonType={lesson.lessonType} />
                <LessonFatigueChips
                  lesson={lesson}
                  viewContext={viewContext}
                  selectedPlayer={selectedPlayer}
                  maxVisible={2}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {formatLessonDate(lesson.lessonDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pr-10">
            <LessonEvidenceChips
              videoCount={videoCount}
              attachmentCount={attachmentCount}
            />
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
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3 sm:space-y-4 sm:px-5 sm:pb-5 sm:pt-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(240px,auto)] md:gap-x-6">
          <div className="min-w-0 space-y-3">
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

            {notesToShow && (
              <p className="line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">
                {notesToShow}
              </p>
            )}
          </div>

          <div className="space-y-2 md:justify-self-end md:text-right">
            <div className="flex flex-wrap gap-2 md:justify-end">
              <LessonDrillsBadge
                lesson={lesson}
                viewContext={viewContext}
                selectedPlayer={selectedPlayer}
              />
            </div>
          </div>
        </div>

        <LessonPlayerCards lesson={lesson} players={playersForContext} />

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
