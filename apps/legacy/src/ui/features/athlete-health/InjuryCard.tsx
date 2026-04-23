import { Chip } from "@heroui/react";

import type { HealthInjury } from "@/application/players/health/getHealthTabData";

import { ResolveButton } from "./ResolveButton";

interface InjuryCardProps {
  injury: HealthInjury;
  isResolved?: boolean;
}

function formatDate(date?: string | null) {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
}

function toSideLabel(side: HealthInjury["side"]) {
  switch (side) {
    case "left":
      return "Left";
    case "right":
      return "Right";
    case "bilateral":
      return "Bilateral";
    default:
      return "None";
  }
}

function toLevelLabel(level: HealthInjury["level"]) {
  switch (level) {
    case "soreness":
      return "Soreness";
    case "injury":
      return "Injury";
    default:
      return "Diagnosed";
  }
}

function statusColor(status: HealthInjury["status"]) {
  switch (status) {
    case "limited":
      return "warning" as const;
    case "resolved":
      return "success" as const;
    default:
      return "default" as const;
  }
}

export function InjuryCard({ injury, isResolved = false }: InjuryCardProps) {
  const startDate = formatDate(injury.startDate);
  const endDate = formatDate(injury.endDate);

  return (
    <article className="rounded-medium border border-divider p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold">
            {injury.bodyPart}
            {injury.focusArea ? ` - ${injury.focusArea}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">Side: {toSideLabel(injury.side)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip size="sm" variant="flat">
            {toLevelLabel(injury.level)}
          </Chip>
          <Chip size="sm" variant="flat" color={statusColor(injury.status)}>
            {injury.status}
          </Chip>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
        <p>Start: {startDate ?? "Unknown"}</p>
        {isResolved && <p>Resolved: {endDate ?? "Unknown"}</p>}
      </div>

      {injury.notes ? (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium">Notes</summary>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {injury.notes}
          </p>
        </details>
      ) : null}

      {!isResolved ? (
        <div className="mt-4">
          <ResolveButton injuryId={injury.id} />
        </div>
      ) : null}
    </article>
  );
}
