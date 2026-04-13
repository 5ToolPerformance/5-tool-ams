export type PerformanceDiscipline = "strength" | "hitting" | "pitching";

export type PerformanceEvidenceSource = "strength" | "hittrax" | "blast";

export type PerformanceMetric = {
  key: string;
  label: string;
  value: number;
  unit?: string;
  sourceGroup: string;
};

export type PerformanceKpi = PerformanceMetric & {
  recordedAt: string;
  sessionId: string;
};

export type PerformanceTrendPoint = {
  date: string;
  value: number;
  sessionId: string;
};

export type PerformanceTrend = {
  key: string;
  label: string;
  unit?: string;
  sourceGroup: string;
  points: PerformanceTrendPoint[];
};

export type PerformanceSessionTableColumn = {
  key: string;
  label: string;
};

export type PerformanceSessionTableRow = {
  id: string;
  cells: Record<string, string>;
};

export type PerformanceEvidenceSession = {
  id: string;
  evaluationId: string;
  discipline: PerformanceDiscipline;
  source: PerformanceEvidenceSource;
  sourceLabel: string;
  recordedAt: string;
  status: string;
  notes: string | null;
  metrics: PerformanceMetric[];
  tableColumns: PerformanceSessionTableColumn[];
  tableRows: PerformanceSessionTableRow[];
};

export type PlayerPerformanceDisciplineData = {
  discipline: PerformanceDiscipline;
  kpis: PerformanceKpi[];
  trends: PerformanceTrend[];
  sessions: PerformanceEvidenceSession[];
};

export type PlayerPerformanceData = Record<
  PerformanceDiscipline,
  PlayerPerformanceDisciplineData
>;
