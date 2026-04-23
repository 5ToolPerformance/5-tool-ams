// ui/features/athlete-performance/pitching/PitchingSessionsSection.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { PitchingSessionList } from "./PitchingSessionList";
import { PitchingSessionViewer } from "./PitchingSessionViewer";
import type { PitchingSession } from "./types";

interface PitchingSessionsSectionProps {
  sessions: PitchingSession[];
  selectedSession: PitchingSession | null;
}

export function PitchingSessionsSection({
  sessions,
  selectedSession,
}: PitchingSessionsSectionProps) {
  return (
    <PerformanceSectionShell
      title="Pitching Sessions"
      description="Browse sessions and inspect detail without external tools."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PitchingSessionList
            sessions={sessions}
            selectedSessionId={selectedSession?.id}
          />
        </div>
        <div className="lg:col-span-2">
          <PitchingSessionViewer session={selectedSession} />
        </div>
      </div>
    </PerformanceSectionShell>
  );
}
