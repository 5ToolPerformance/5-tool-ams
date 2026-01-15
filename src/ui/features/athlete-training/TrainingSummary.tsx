// ui/features/training/TrainingSummary.tsx
import { SectionShell } from "@/ui/core/athletes/SectionShell";

export async function TrainingSummary() {
  return (
    <SectionShell
      title="Training Summary"
      description="Recent workload and focus areas"
    >
      <div className="space-y-2 text-sm">
        <p>• 6 lessons in the last 14 days</p>
        <p>• Primary focus: Pitching mechanics</p>
        <p>• Secondary focus: Lower body strength</p>
      </div>
    </SectionShell>
  );
}
