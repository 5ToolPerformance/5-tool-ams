// ui/features/athlete-performance/hitting/HittingSessionMetricsPanel.tsx
import type { HittingSession, HittingSystem } from "./types";

interface HittingSessionMetricsPanelProps {
  session: HittingSession;
}

const systemDescriptions: Record<HittingSystem, string> = {
  hittrax: "HitTrax metrics and batted ball outcomes.",
  blast: "Blast Motion swing metrics.",
  lesson: "Lesson-derived cues and context.",
};

export function HittingSessionMetricsPanel({
  session,
}: HittingSessionMetricsPanelProps) {
  const metrics = [
    { key: "avgEV", label: "Avg EV", value: session.metrics?.avgEV, unit: "mph" },
    { key: "maxEV", label: "Max EV", value: session.metrics?.maxEV, unit: "mph" },
    { key: "avgLA", label: "Avg LA", value: session.metrics?.avgLA, unit: "deg" },
    {
      key: "batSpeed",
      label: "Bat Speed",
      value: session.metrics?.batSpeed,
      unit: "mph",
    },
    {
      key: "attackAngle",
      label: "Attack Angle",
      value: session.metrics?.attackAngle,
      unit: "deg",
    },
  ].filter((metric) => metric.value !== undefined);

  return (
    <div className="space-y-3 rounded-lg border border-divider p-4">
      <div>
        <p className="text-sm font-semibold">Session Metrics</p>
        <p className="text-xs text-muted-foreground">
          {systemDescriptions[session.system]}
        </p>
      </div>

      {metrics.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No metrics available for this session yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {metrics.map((metric) => (
            <div key={metric.key} className="space-y-1">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="font-semibold">
                {metric.value} {metric.unit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
