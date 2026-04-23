// ui/features/athlete-performance/hitting/HittingSessionsSection.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { HittingSessionList } from "./HittingSessionList";
import { HittingSessionViewer } from "./HittingSessionViewer";
import type { HittingSession } from "./types";

interface HittingSessionsSectionProps {
  sessions: HittingSession[];
  selectedSession: HittingSession | null;
}

export function HittingSessionsSection({
  sessions,
  selectedSession,
}: HittingSessionsSectionProps) {
  return (
    <PerformanceSectionShell
      title="Hitting Sessions"
      description="Browse sessions and inspect detail without leaving the AMS."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <HittingSessionList
            sessions={sessions}
            selectedSessionId={selectedSession?.id}
          />
        </div>
        <div className="lg:col-span-2">
          <HittingSessionViewer session={selectedSession} />
        </div>
      </div>
    </PerformanceSectionShell>
  );
}
