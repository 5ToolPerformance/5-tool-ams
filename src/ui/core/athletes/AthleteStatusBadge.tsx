// ui/core/PlayerStatusBadges.tsx
import { Chip } from "@heroui/react";

export type AthleteHeaderStatus =
  | "Active"
  | "Soreness"
  | "Injury"
  | "Diagnosed Injury";

interface AthleteStatusBadgesProps {
  statuses: AthleteHeaderStatus[];
}

function getStatusChip(status: AthleteHeaderStatus) {
  if (status === "Soreness") {
    return (
      <Chip key={status} size="sm" variant="flat" color="warning">
        {status}
      </Chip>
    );
  }

  if (status === "Injury") {
    return (
      <Chip
        key={status}
        size="sm"
        variant="flat"
        classNames={{
          base:
            "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
        }}
      >
        {status}
      </Chip>
    );
  }

  if (status === "Diagnosed Injury") {
    return (
      <Chip key={status} size="sm" variant="flat" color="danger">
        {status}
      </Chip>
    );
  }

  return (
    <Chip key={status} size="sm" variant="flat" color="success">
      {status}
    </Chip>
  );
}

export function AthleteStatusBadges({ statuses }: AthleteStatusBadgesProps) {
  return <div className="flex flex-wrap gap-2">{statuses.map(getStatusChip)}</div>;
}
