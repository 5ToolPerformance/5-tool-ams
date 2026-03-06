export type DashboardTabKey = "overview" | "coaches" | "players" | "systems";
export type DashboardRangeKey = "7d" | "30d" | "90d" | "all";

export type DashboardLessonType =
  | "strength"
  | "hitting"
  | "pitching"
  | "fielding"
  | "catching";

export interface DashboardRangeWindow {
  key: DashboardRangeKey;
  startIso: string | null;
  endIso: string;
}

export interface DashboardLessonTypeMetric {
  lessonType: DashboardLessonType;
  count: number;
  percentage: number;
}

export interface DashboardDailyLessonsMetric {
  date: string;
  lessons: number;
}

export interface DashboardOverviewData {
  range: DashboardRangeWindow;
  totalLessons: number;
  activeCoaches: number;
  activePlayers: number;
  lessonTypeBreakdown: DashboardLessonTypeMetric[];
  dailyLessons: DashboardDailyLessonsMetric[];
}

export interface DashboardCoachMetricRow {
  coachId: string;
  coachName: string;
  lessonsLogged: number;
  uniquePlayers: number;
  avgLogDelayDays: number;
}

export interface DashboardCoachesData {
  range: DashboardRangeWindow;
  totalCoachesActive: number;
  totalLessonsLogged: number;
  avgLogDelayDays: number;
  coachRows: DashboardCoachMetricRow[];
}

export interface DashboardPlayerMetricRow {
  playerId: string;
  firstName: string;
  lastName: string;
  lessons: number;
  uniqueCoaches: number;
  latestLessonDate: string | null;
}

export type IncompleteProfileReason =
  | "missing_first_name"
  | "missing_last_name"
  | "missing_primary_coach"
  | "invalid_throws"
  | "invalid_hits"
  | "age_under_5";

export interface IncompletePlayerProfile {
  playerId: string;
  firstName: string;
  lastName: string;
  reasons: IncompleteProfileReason[];
}

export interface DashboardPlayersData {
  range: DashboardRangeWindow;
  activePlayers: number;
  totalLessons: number;
  avgLessonsPerPlayer: number;
  playerRows: DashboardPlayerMetricRow[];
  incompleteProfiles: IncompletePlayerProfile[];
}

