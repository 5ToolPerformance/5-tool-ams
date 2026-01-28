// ui/features/overview/CurrentFocusSection.tsx
import { Chip } from "@heroui/react";

import { SectionShell } from "@/ui/core/athletes/SectionShell";

interface CurrentFocusSectionProps {
  data: {
    mechanics: { id: string; name: string }[];
  };
}

export function CurrentFocusSection({ data }: CurrentFocusSectionProps) {
  return (
    <SectionShell
      title="Current Focus & Availability"
      description="Active mechanics and athlete status"
    >
      <div className="space-y-4">
        {/* Active Mechanics */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Active Mechanics</h4>

          {data.mechanics.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active mechanics identified recently.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.mechanics.map((m) => (
                <Chip key={m.id} size="sm" variant="flat">
                  {m.name}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
