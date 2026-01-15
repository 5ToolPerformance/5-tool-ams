// ui/features/overview/RecentActivitySection.tsx
import { SectionShell } from "@/ui/core/athletes/SectionShell";

export async function RecentActivitySection() {
  return (
    <SectionShell title="Recent Activity" description="Last 7–14 days">
      <ul className="space-y-3 text-sm">
        <li>
          <span className="font-medium">01/14</span> — Pitching Lesson
          <span className="text-muted-foreground"> · Arm path & tempo</span>
        </li>
        <li>
          <span className="font-medium">01/12</span> — Strength Session
          <span className="text-muted-foreground"> · Lower body power</span>
        </li>
        <li>
          <span className="font-medium">01/10</span> — Hitting Lesson
          <span className="text-muted-foreground"> · Launch position</span>
        </li>
      </ul>
    </SectionShell>
  );
}
