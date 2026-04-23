import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

import { LESSON_TYPE_CONFIG } from "./lessonTypeConfig";

export function LessonTypeBadge({
  lessonType,
}: {
  lessonType: LessonCardData["lessonType"];
}) {
  const cfg = LESSON_TYPE_CONFIG[lessonType];
  const Icon = cfg.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder} `}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </div>
  );
}
