// ui/features/overview/PerformanceSnapshot.tsx
import { Chip } from "@heroui/react";

import { SectionShell } from "@/ui/core/athletes/SectionShell";

export async function PerformanceSnapshot() {
  return (
    <SectionShell title="Performance Snapshot">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Hitting</span>
          <Chip size="sm" color="success">
            Stable
          </Chip>
        </div>
        <div className="flex justify-between">
          <span>Pitching</span>
          <Chip size="sm" color="primary">
            Improving
          </Chip>
        </div>
        <div className="flex justify-between">
          <span>Strength</span>
          <Chip size="sm" color="warning">
            Needs Attention
          </Chip>
        </div>
      </div>
    </SectionShell>
  );
}
