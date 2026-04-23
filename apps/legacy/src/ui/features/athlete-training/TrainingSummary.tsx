import { Chip } from "@heroui/react";

import { TrainingSummaryData } from "@/domain/player/training";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

interface TrainingSummaryProps {
  data: TrainingSummaryData;
}

export function TrainingSummary({ data }: TrainingSummaryProps) {
  const { volume, focus, mechanics } = data;

  return (
    <SectionShell
      title="Training Summary"
      description="Recent workload and training intent"
    >
      <div className="space-y-6 text-sm">
        {/* ---------------- Volume ---------------- */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryStat label="Lessons (14d)" value={volume.lessons14d} />
          <SummaryStat label="Lessons (30d)" value={volume.lessons30d} />
          <SummaryStat label="Avg / week" value={volume.avgPerWeek30d} />
        </div>

        {/* ---------------- Focus ---------------- */}
        {focus.primaryDiscipline && (
          <div>
            <p className="mb-1 text-muted-foreground">Primary focus</p>
            <p className="font-medium capitalize">
              {focus.primaryDiscipline}
              {focus.secondaryDiscipline && (
                <span className="text-muted-foreground">
                  {" "}
                  • {focus.secondaryDiscipline}
                </span>
              )}
            </p>
          </div>
        )}

        {/* ---------------- Mechanics ---------------- */}
        {mechanics.top.length > 0 && (
          <div>
            <p className="mb-2 text-muted-foreground">Top mechanics</p>
            <div className="flex flex-wrap gap-2">
              {mechanics.top.map((m) => (
                <Chip
                  key={m.id}
                  size="sm"
                  variant="flat"
                  className="capitalize"
                >
                  {m.name}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Small internal helper for consistent stat presentation                       */
/* -------------------------------------------------------------------------- */

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
