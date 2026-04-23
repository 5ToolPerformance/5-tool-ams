// ui/features/athlete-performance/pitching/PitchingSessionViewer.tsx
import { Chip } from "@heroui/react";

import { PitchingSessionMetricsPanel } from "./PitchingSessionMetricsPanel";
import { PitchShapeChart } from "./PitchShapeChart";
import type { PitchingSession, PitchingSystem } from "./types";

interface PitchingSessionViewerProps {
  session: PitchingSession | null;
}

const systemLabels: Record<PitchingSystem, string> = {
  armcare: "ArmCare",
  trackman: "TrackMan",
};

export function PitchingSessionViewer({
  session,
}: PitchingSessionViewerProps) {
  if (!session) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-xs text-muted-foreground">
        Select a session to view details.
      </div>
    );
  }

  const showPitchShape = session.system === "trackman";

  return (
    <div className="space-y-4 rounded-lg border border-divider p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Session Detail</p>
          <p className="text-xs text-muted-foreground">
            {session.date} · {session.sessionType}
          </p>
        </div>
        <Chip size="sm" variant="flat">
          {systemLabels[session.system]}
        </Chip>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div>Throws: {session.throws ?? session.pitches ?? "N/A"}</div>
        <div>Lesson: {session.lessonRef ?? "None"}</div>
        <div>Health: {session.healthRef ?? "No health note"}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {showPitchShape && <PitchShapeChart />}
        <div className={showPitchShape ? "" : "lg:col-span-2"}>
          <PitchingSessionMetricsPanel session={session} />
        </div>
      </div>

      <div className="rounded-md border border-dashed border-divider p-3 text-xs text-muted-foreground">
        Lesson and health context expand here when linked.
      </div>
    </div>
  );
}
