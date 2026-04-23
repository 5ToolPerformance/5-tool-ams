// ui/features/athlete-performance/strength/StrengthSessionTable.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import type { StrengthSession } from "./types";
import { StrengthSessionTableClient } from "./StrengthSessionTableClient";

interface StrengthSessionTableProps {
  sessions: StrengthSession[];
}

export function StrengthSessionTable({ sessions }: StrengthSessionTableProps) {
  return (
    <PerformanceSectionShell
      title="Strength Sessions"
      description="Session-level transparency across recent tests."
    >
      <StrengthSessionTableClient sessions={sessions} />
    </PerformanceSectionShell>
  );
}
