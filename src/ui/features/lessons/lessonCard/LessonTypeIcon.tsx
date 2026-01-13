import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

import { LESSON_TYPE_CONFIG } from "./lessonTypeConfig";

export function LessonTypeIcon({
  lessonType,
}: {
  lessonType: LessonCardData["lessonType"];
}) {
  const cfg = LESSON_TYPE_CONFIG[lessonType];
  const Icon = cfg.icon;

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${cfg.iconBg} ${cfg.iconText}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
