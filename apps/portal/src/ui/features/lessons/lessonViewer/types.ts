import { LessonCardData } from "@ams/db/queries/lessons/lessonQueries.types";

export type ViewContext = "coach" | "player";

export interface LessonViewerProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  playerId?: string;
  className?: string;
  returnTo?: string;
}

export interface LessonViewerSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
