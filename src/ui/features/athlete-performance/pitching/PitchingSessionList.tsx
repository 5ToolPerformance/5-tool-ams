// ui/features/athlete-performance/pitching/PitchingSessionList.tsx
import { Chip } from "@heroui/react";

import type { PitchingSession, PitchingSystem } from "./types";

interface PitchingSessionListProps {
  sessions: PitchingSession[];
  selectedSessionId?: string;
}

const systemLabels: Record<PitchingSystem, string> = {
  armcare: "ArmCare",
  trackman: "TrackMan",
};

function formatMetric(value?: number, unit?: string) {
  if (value === undefined) {
    return "N/A";
  }
  return unit ? `${value} ${unit}` : `${value}`;
}

export function PitchingSessionList({
  sessions,
  selectedSessionId,
}: PitchingSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-xs text-muted-foreground">
        No sessions available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isSelected = session.id === selectedSessionId;
        return (
          <div
            key={session.id}
            className={`rounded-lg border p-3 ${
              isSelected
                ? "border-primary/40 bg-content2"
                : "border-divider"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{session.date}</p>
                <p className="text-xs text-muted-foreground">
                  {session.sessionType} · {session.lessonRef ?? "No lesson"}
                </p>
              </div>
              <Chip size="sm" variant="flat">
                {systemLabels[session.system]}
              </Chip>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>Throws: {session.throws ?? session.pitches ?? "N/A"}</div>
              <div>
                Avg velo: {formatMetric(session.metrics?.avgVelo, "mph")}
              </div>
              <div>
                Max velo: {formatMetric(session.metrics?.maxVelo, "mph")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
