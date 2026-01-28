import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

export interface TrainingSummaryData {
  volume: {
    lessons14d: number;
    lessons30d: number;
    avgPerWeek30d: number;
  };
  focus: {
    primaryDiscipline: LessonCardData["lessonType"] | null;
    secondaryDiscipline: LessonCardData["lessonType"] | null;
    breakdown: {
      discipline: LessonCardData["lessonType"];
      count: number;
    }[];
  };
  mechanics: {
    top: {
      id: string;
      name: string;
      count: number;
    }[];
  };
}
