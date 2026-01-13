import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

export type ViewContext = "coach" | "player";

export interface LessonViewerProps {
  lesson: LessonCardData;
  viewContext: ViewContext;
  className?: string;
}

export interface LessonViewerSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
