// ui/features/athlete-performance/pitching/PitchingSessionMetricsPanel.tsx
import type { PitchingSession, PitchingSystem } from "./types";

interface PitchingSessionMetricsPanelProps {
  session: PitchingSession;
}

const systemDescriptions: Record<PitchingSystem, string> = {
  armcare: "ArmCare workload and intensity signals.",
  trackman: "TrackMan pitch metrics and movement.",
};

export function PitchingSessionMetricsPanel({
  session,
}: PitchingSessionMetricsPanelProps) {
  const metrics = [
    {
      key: "avgVelo",
      label: "Avg Velo",
      value: session.metrics?.avgVelo,
      unit: "mph",
    },
    {
      key: "maxVelo",
      label: "Max Velo",
      value: session.metrics?.maxVelo,
      unit: "mph",
    },
    {
      key: "spinRate",
      label: "Spin Rate",
      value: session.metrics?.spinRate,
      unit: "rpm",
    },
    {
      key: "horizBreak",
      label: "Horiz Break",
      value: session.metrics?.horizBreak,
      unit: "in",
    },
    {
      key: "vertBreak",
      label: "Vert Break",
      value: session.metrics?.vertBreak,
      unit: "in",
    },
    {
      key: "acuteWorkload",
      label: "Acute Load",
      value: session.workload?.acute,
      unit: "",
    },
    {
      key: "chronicWorkload",
      label: "Chronic Load",
      value: session.workload?.chronic,
      unit: "",
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
