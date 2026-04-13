import type {
  PerformanceDiscipline,
  PerformanceEvidenceSession,
  PerformanceEvidenceSource,
  PerformanceKpi,
  PerformanceMetric,
  PerformanceSessionTableColumn,
  PerformanceSessionTableRow,
  PerformanceTrend,
  PlayerPerformanceData,
} from "./getPlayerPerformanceData.types";

type MetricDefinition = {
  key: string;
  label: string;
  unit?: string;
  sourceGroup: string;
};

type EvidenceRow = {
  sessionId: string;
  evaluationId: string;
  source: PerformanceEvidenceSource;
  recordedAt: Date | string;
  status: string;
  notes: string | null;
  metrics: Record<string, string | number | null | undefined>;
};

export type HittraxEventRow = {
  id: string;
  sessionId: string;
  eventIndex: number;
  atBat: number | null;
  pitchVelocity: string | null;
  pitchType: string | null;
  exitVelo: string | null;
  launchAngle: string | null;
  distance: string | null;
  horizontalAngle: string | null;
  contactType: string | null;
  result: string | null;
};

export type BuildPlayerPerformanceDataInput = {
  strengthRows: EvidenceRow[];
  hittraxRows: EvidenceRow[];
  blastRows: EvidenceRow[];
  hittraxEventsBySessionId?: Record<string, HittraxEventRow[]>;
};

const SOURCE_LABELS: Record<PerformanceEvidenceSource, string> = {
  strength: "Strength",
  hittrax: "HitTrax",
  blast: "Blast",
};

const SOURCE_DISCIPLINES: Record<
  PerformanceEvidenceSource,
  PerformanceDiscipline
> = {
  strength: "strength",
  hittrax: "hitting",
  blast: "hitting",
};

const METRIC_DEFINITIONS: Record<
  PerformanceEvidenceSource,
  MetricDefinition[]
> = {
  strength: [
    { key: "powerRating", label: "Power Rating", sourceGroup: "Strength" },
    { key: "rotation", label: "Rotation", sourceGroup: "Strength" },
    {
      key: "lowerBodyStrength",
      label: "Lower Body Strength",
      sourceGroup: "Strength",
    },
    {
      key: "upperBodyStrength",
      label: "Upper Body Strength",
      sourceGroup: "Strength",
    },
  ],
  hittrax: [
    {
      key: "exitVelocityMax",
      label: "Max Exit Velocity",
      unit: "mph",
      sourceGroup: "HitTrax",
    },
    {
      key: "exitVelocityAvg",
      label: "Avg Exit Velocity",
      unit: "mph",
      sourceGroup: "HitTrax",
    },
    {
      key: "hardHitPercent",
      label: "Hard Hit %",
      unit: "%",
      sourceGroup: "HitTrax",
    },
    {
      key: "launchAngleAvg",
      label: "Avg Launch Angle",
      unit: "deg",
      sourceGroup: "HitTrax",
    },
    {
      key: "lineDriveAvg",
      label: "Line Drive %",
      unit: "%",
      sourceGroup: "HitTrax",
    },
  ],
  blast: [
    {
      key: "batSpeedMax",
      label: "Max Bat Speed",
      unit: "mph",
      sourceGroup: "Blast",
    },
    {
      key: "batSpeedAvg",
      label: "Avg Bat Speed",
      unit: "mph",
      sourceGroup: "Blast",
    },
    {
      key: "rotAccMax",
      label: "Max Rotational Accel",
      sourceGroup: "Blast",
    },
    {
      key: "rotAccAvg",
      label: "Avg Rotational Accel",
      sourceGroup: "Blast",
    },
    {
      key: "onPlanePercent",
      label: "On Plane %",
      unit: "%",
      sourceGroup: "Blast",
    },
    {
      key: "attackAngleAvg",
      label: "Avg Attack Angle",
      unit: "deg",
      sourceGroup: "Blast",
    },
    {
      key: "earlyConnAvg",
      label: "Early Connection",
      sourceGroup: "Blast",
    },
    {
      key: "connAtImpactAvg",
      label: "Connection At Impact",
      sourceGroup: "Blast",
    },
    {
      key: "verticalBatAngleAvg",
      label: "Vertical Bat Angle",
      unit: "deg",
      sourceGroup: "Blast",
    },
    {
      key: "timeToContactAvg",
      label: "Time To Contact",
      unit: "sec",
      sourceGroup: "Blast",
    },
    {
      key: "handSpeedMax",
      label: "Max Hand Speed",
      unit: "mph",
      sourceGroup: "Blast",
    },
    {
      key: "handSpeedAvg",
      label: "Avg Hand Speed",
      unit: "mph",
      sourceGroup: "Blast",
    },
  ],
};

const METRIC_TABLE_COLUMNS: PerformanceSessionTableColumn[] = [
  { key: "metric", label: "Metric" },
  { key: "value", label: "Value" },
  { key: "source", label: "Source" },
];

const HITTRAX_EVENT_TABLE_COLUMNS: PerformanceSessionTableColumn[] = [
  { key: "eventIndex", label: "Event" },
  { key: "atBat", label: "AB" },
  { key: "exitVelo", label: "Exit Velo" },
  { key: "launchAngle", label: "Launch Angle" },
  { key: "distance", label: "Distance" },
  { key: "pitchVelocity", label: "Pitch Velo" },
  { key: "pitchType", label: "Pitch Type" },
  { key: "contactType", label: "Contact" },
  { key: "result", label: "Result" },
];

function createEmptyDiscipline(
  discipline: PerformanceDiscipline
): PlayerPerformanceData[PerformanceDiscipline] {
  return {
    discipline,
    kpis: [],
    trends: [],
    sessions: [],
  };
}

function toIsoString(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMetricValue(metric: PerformanceMetric) {
  return metric.unit ? `${metric.value} ${metric.unit}` : String(metric.value);
}

function formatCell(value: string | number | null | undefined, unit?: string) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return unit ? `${value} ${unit}` : String(value);
}

function mapMetrics(row: EvidenceRow): PerformanceMetric[] {
  return METRIC_DEFINITIONS[row.source].flatMap((definition) => {
      const value = toNumber(row.metrics[definition.key]);
      if (value === null) {
        return [];
      }

      const metric: PerformanceMetric = {
        key: definition.key,
        label: definition.label,
        value,
        unit: definition.unit,
        sourceGroup: definition.sourceGroup,
      };

      return [metric];
    });
}

function buildMetricTableRows(
  metrics: PerformanceMetric[]
): PerformanceSessionTableRow[] {
  return metrics.map((metric) => ({
    id: metric.key,
    cells: {
      metric: metric.label,
      value: formatMetricValue(metric),
      source: metric.sourceGroup,
    },
  }));
}

function buildHittraxEventTableRows(
  rows: HittraxEventRow[]
): PerformanceSessionTableRow[] {
  return rows
    .slice()
    .sort((a, b) => a.eventIndex - b.eventIndex)
    .map((row) => ({
      id: row.id,
      cells: {
        eventIndex: String(row.eventIndex),
        atBat: formatCell(row.atBat),
        exitVelo: formatCell(row.exitVelo, "mph"),
        launchAngle: formatCell(row.launchAngle, "deg"),
        distance: formatCell(row.distance, "ft"),
        pitchVelocity: formatCell(row.pitchVelocity, "mph"),
        pitchType: formatCell(row.pitchType),
        contactType: formatCell(row.contactType),
        result: formatCell(row.result),
      },
    }));
}

function mapEvidenceRowToSession(
  row: EvidenceRow,
  hittraxEventsBySessionId: Record<string, HittraxEventRow[]>
): PerformanceEvidenceSession {
  const metrics = mapMetrics(row);
  const eventRows =
    row.source === "hittrax"
      ? (hittraxEventsBySessionId[row.sessionId] ?? [])
      : [];

  return {
    id: row.sessionId,
    evaluationId: row.evaluationId,
    discipline: SOURCE_DISCIPLINES[row.source],
    source: row.source,
    sourceLabel: SOURCE_LABELS[row.source],
    recordedAt: toIsoString(row.recordedAt),
    status: row.status,
    notes: row.notes,
    metrics,
    tableColumns:
      eventRows.length > 0 ? HITTRAX_EVENT_TABLE_COLUMNS : METRIC_TABLE_COLUMNS,
    tableRows:
      eventRows.length > 0
        ? buildHittraxEventTableRows(eventRows)
        : buildMetricTableRows(metrics),
  };
}

function sortSessionsDescending(
  sessions: PerformanceEvidenceSession[]
): PerformanceEvidenceSession[] {
  return sessions
    .slice()
    .sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
}

function buildKpis(sessions: PerformanceEvidenceSession[]): PerformanceKpi[] {
  const byMetric = new Map<string, PerformanceKpi>();

  for (const session of sessions) {
    for (const metric of session.metrics) {
      const key = `${metric.sourceGroup}:${metric.key}`;
      if (!byMetric.has(key)) {
        byMetric.set(key, {
          ...metric,
          recordedAt: session.recordedAt,
          sessionId: session.id,
        });
      }
    }
  }

  return Array.from(byMetric.values());
}

function buildTrends(sessions: PerformanceEvidenceSession[]): PerformanceTrend[] {
  const byMetric = new Map<string, PerformanceTrend>();

  for (const session of sessions.slice().reverse()) {
    for (const metric of session.metrics) {
      const key = `${metric.sourceGroup}:${metric.key}`;
      const trend =
        byMetric.get(key) ??
        ({
          key,
          label: metric.label,
          unit: metric.unit,
          sourceGroup: metric.sourceGroup,
          points: [],
        } satisfies PerformanceTrend);

      trend.points.push({
        date: session.recordedAt,
        value: metric.value,
        sessionId: session.id,
      });
      byMetric.set(key, trend);
    }
  }

  return Array.from(byMetric.values()).filter(
    (trend) => trend.points.length > 0
  );
}

function buildDisciplineData(
  discipline: PerformanceDiscipline,
  sessions: PerformanceEvidenceSession[]
): PlayerPerformanceData[PerformanceDiscipline] {
  const sortedSessions = sortSessionsDescending(sessions);

  return {
    discipline,
    sessions: sortedSessions,
    kpis: buildKpis(sortedSessions),
    trends: buildTrends(sortedSessions),
  };
}

export function buildPlayerPerformanceData({
  strengthRows,
  hittraxRows,
  blastRows,
  hittraxEventsBySessionId = {},
}: BuildPlayerPerformanceDataInput): PlayerPerformanceData {
  const strengthSessions = strengthRows.map((row) =>
    mapEvidenceRowToSession(row, hittraxEventsBySessionId)
  );
  const hittingSessions = [...hittraxRows, ...blastRows].map((row) =>
    mapEvidenceRowToSession(row, hittraxEventsBySessionId)
  );

  return {
    strength: buildDisciplineData("strength", strengthSessions),
    hitting: buildDisciplineData("hitting", hittingSessions),
    pitching: createEmptyDiscipline("pitching"),
  };
}
