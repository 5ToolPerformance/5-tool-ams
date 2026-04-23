import { listDrillsForLibrary } from "@/application/drills/listDrillsForLibrary";
import { getAuthContext } from "@/application/auth/auth-context";
import { DrillsLibraryPageClient } from "@/ui/features/drills/DrillsLibraryPageClient";

export default async function ResourcesDrillsPage() {
  const ctx = await getAuthContext();

  const drills = await listDrillsForLibrary(ctx.facilityId, {
    role: ctx.role,
    userId: ctx.userId,
  });

  return <DrillsLibraryPageClient drills={drills} viewerRole={ctx.role} />;
}
