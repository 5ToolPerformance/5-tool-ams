export type WeeklyUsageReportDocument = {
  version: 1;

  scope: {
    facilityId: string | null;
    facilityName?: string | null;
  };

  range: {
    weekStart: string;
    weekEnd: string;
    label: string;
    timezone: string;
  };

  summary: {
    activePlayers: number;
    activeCoaches: number;
    lessonsCreated: number;
    newPlayersAdded: number;
    injuriesLogged: number;
  };

  coaches: {
    totalCoachesIncluded: number;
    items: WeeklyUsageReportCoachSnapshot[];
  };

  notes?: {
    generatedFrom?: string[];
    warnings?: string[];
  };
};

export type LessonTypeKey =
  | "hitting"
  | "pitching"
  | "fielding"
  | "catching"
  | "strength"
  | "recovery"
  | "other";

export type WeeklyUsageReportCoachSnapshot = {
  coachId: string;
  coachName: string;

  totals: {
    lessonsLogged: number;
    playersWorkedWith: number;
  };

  lessonsByType: Record<LessonTypeKey, number>;
};
