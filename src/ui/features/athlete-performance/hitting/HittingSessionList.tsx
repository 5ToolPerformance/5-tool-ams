// ui/features/athlete-performance/hitting/HittingSessionList.tsx
import { Chip } from "@heroui/react";

import type { HittingSession, HittingSystem } from "./types";

interface HittingSessionListProps {
  sessions: HittingSession[];
  selectedSessionId?: string;
}

const systemLabels: Record<HittingSystem, string> = {
  hittrax: "HitTrax",
  blast: "Blast",
  lesson: "Lesson-only",
};

function formatMetric(value?: number, unit?: string) {
  if (value === undefined) {
    return "N/A";
  }
  return unit ? `${value} ${unit}` : `${value}`;
}

export function HittingSessionList({
  sessions,
  selectedSessionId,
}: HittingSessionListProps) {
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
                  {session.lessonRef ?? "No linked lesson"}
                </p>
              </div>
              <Chip size="sm" variant="flat">
                {systemLabels[session.system]}
              </Chip>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>Swings: {session.swings ?? "N/A"}</div>
              <div>
                Avg EV: {formatMetric(session.metrics?.avgEV, "mph")}
              </div>
              <div>
                Max EV: {formatMetric(session.metrics?.maxEV, "mph")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
