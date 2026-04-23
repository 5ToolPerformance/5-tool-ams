// app/players/[playerId]/performance/layout.tsx
import { PerformanceHeader } from "@/ui/features/athlete-performance/shared/PerformanceHeader";
import type { ReactNode } from "react";

const PERFORMANCE_DISCIPLINES = [
  { key: "strength", label: "Strength" },
  { key: "hitting", label: "Hitting" },
  { key: "pitching", label: "Pitching" },
];

export default function PerformanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PerformanceHeader
        description="Evaluation evidence from recorded performance sessions."
        disciplines={PERFORMANCE_DISCIPLINES}
      />
      {children}
    </div>
  );
}
