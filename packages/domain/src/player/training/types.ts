import type { LessonDiscipline } from "../shared/lesson-summary";

export interface TrainingSummaryData {
  volume: {
    lessons14d: number;
    lessons30d: number;
    avgPerWeek30d: number;
  };
  focus: {
    primaryDiscipline: LessonDiscipline | null;
    secondaryDiscipline: LessonDiscipline | null;
    breakdown: {
      discipline: LessonDiscipline;
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
