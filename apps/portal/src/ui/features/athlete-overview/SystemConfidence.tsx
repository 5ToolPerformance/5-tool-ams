// ui/features/overview/SystemConfidence.tsx
import { Chip } from "@heroui/react";

import { SectionShell } from "@/ui/core/athletes/SectionShell";

export async function SystemConfidence() {
  return (
    <SectionShell title="System Confidence">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Hawkin</span>
          <Chip size="sm" color="success">
            Synced
          </Chip>
        </div>
        <div className="flex justify-between">
          <span>ArmCare</span>
          <Chip size="sm" color="warning">
            Out of date
          </Chip>
        </div>
        <div className="flex justify-between">
          <span>HitTrax</span>
          <Chip size="sm" variant="flat">
            Not linked
          </Chip>
        </div>
      </div>
    </SectionShell>
  );
}
