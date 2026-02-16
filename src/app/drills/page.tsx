import { redirect } from "next/navigation";

import { listDrillsForLibrary } from "@/application/drills/listDrillsForLibrary";
import { getAuthContext } from "@/lib/auth/auth-context";
import { DrillsLibraryPageClient } from "@/ui/features/drills/DrillsLibraryPageClient";

export default async function DrillsPage() {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }

  const drills = await listDrillsForLibrary(ctx.facilityId, {
    role: ctx.role,
    userId: ctx.userId,
  });

  return <DrillsLibraryPageClient drills={drills} />;
}
