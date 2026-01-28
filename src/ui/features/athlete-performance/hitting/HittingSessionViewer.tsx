// ui/features/athlete-performance/hitting/HittingSessionViewer.tsx
import { Chip } from "@heroui/react";

import { HittingSessionMetricsPanel } from "./HittingSessionMetricsPanel";
import { SprayChart } from "./SprayChart";
import type { HittingSession, HittingSystem } from "./types";

interface HittingSessionViewerProps {
  session: HittingSession | null;
}

const systemLabels: Record<HittingSystem, string> = {
  hittrax: "HitTrax",
  blast: "Blast",
  lesson: "Lesson-only",
};

export function HittingSessionViewer({ session }: HittingSessionViewerProps) {
  if (!session) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-xs text-muted-foreground">
        Select a session to view details.
      </div>
    );
  }

  const showSprayChart = session.system === "hittrax";

  return (
    <div className="space-y-4 rounded-lg border border-divider p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Session Detail</p>
          <p className="text-xs text-muted-foreground">
            {session.date} · {session.lessonRef ?? "No linked lesson"}
          </p>
        </div>
        <Chip size="sm" variant="flat">
          {systemLabels[session.system]}
        </Chip>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div>Swings: {session.swings ?? "N/A"}</div>
        <div>System: {systemLabels[session.system]}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {showSprayChart && <SprayChart points={session.sprayChart} />}
        <div className={showSprayChart ? "" : "lg:col-span-2"}>
          <HittingSessionMetricsPanel session={session} />
        </div>
      </div>

      <div className="rounded-md border border-dashed border-divider p-3 text-xs text-muted-foreground">
        Lesson notes and intent cues will appear here when linked.
      </div>
    </div>
  );
}
