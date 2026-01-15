// ui/core/PlayerStatusBadges.tsx
import { Chip } from "@heroui/react";

interface AthleteStatusBadgesProps {
  statuses: string[];
}

export function AthleteStatusBadges({ statuses }: AthleteStatusBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Chip
          key={status}
          size="sm"
          variant="flat"
          color={
            status === "Active"
              ? "success"
              : status === "Injured"
                ? "danger"
                : "warning"
          }
        >
          {status}
        </Chip>
      ))}
    </div>
  );
}
