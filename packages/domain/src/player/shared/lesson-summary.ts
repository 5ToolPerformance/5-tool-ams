export type LessonDiscipline =
  | "strength"
  | "hitting"
  | "pitching"
  | "fielding"
  | "catching";

export interface LessonMechanicSummary {
  id: string;
  name: string;
}

export interface LessonSummary {
  id: string;
  lessonDate: string;
  lessonType: LessonDiscipline;
  mechanics: LessonMechanicSummary[];
}
