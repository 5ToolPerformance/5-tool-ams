// app/players/[playerId]/performance/layout.tsx
import { PerformanceHeader } from "@/ui/features/athlete-performance/shared/PerformanceHeader";
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";
import type { ReactNode } from "react";

export default function PerformanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Shared performance controls */}
      <PerformanceHeader />

      {/* Discipline-specific analytics */}
      <PerformanceSectionShell title="Discipline Analytics">
        {children}
      </PerformanceSectionShell>
    </div>
  );
}
