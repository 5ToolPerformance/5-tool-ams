import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

export type ViewContext = "coach" | "player";

export interface LessonCardProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  playerId?: string;
  className?: string;
}

export interface LessonCardListProps {
  lessons: LessonCardData[];
  viewContext: ViewContext;
  playerId?: string;
  emptyMessage?: string;
  maxHeight?: string;
  className?: string;
}
