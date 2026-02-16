import { redirect } from "next/navigation";

import { getAuthContext } from "@/lib/auth/auth-context";
import { DrillForm } from "@/ui/features/drills/DrillForm";

export default async function NewDrillPage() {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }

  return <DrillForm mode="create" />;
}
