// ui/features/overview/CurrentFocusSection.tsx
import { Chip } from "@heroui/react";

import { SectionShell } from "@/ui/core/athletes/SectionShell";

export async function CurrentFocusSection() {
  return (
    <SectionShell
      title="Current Focus & Risk"
      description="Active mechanics and athlete availability"
    >
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium">Active Mechanics</h4>
          <div className="flex flex-wrap gap-2">
            <Chip size="sm" variant="flat">
              Hip / Shoulder Separation
            </Chip>
            <Chip size="sm" variant="flat">
              Front Foot Timing
            </Chip>
            <Chip size="sm" variant="flat">
              Lead Arm Stability
            </Chip>
          </div>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium">Injury Status</h4>
          <p className="text-sm text-muted-foreground">
            Shoulder soreness — throwing volume limited
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
