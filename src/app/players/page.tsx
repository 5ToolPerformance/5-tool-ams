import { redirect } from "next/navigation";

import { getAuthContext } from "@/lib/auth/auth-context";
import PlayersPageClient from "@/ui/features/players/PlayersPageClient";

export default async function PlayersPage() {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }

  return <PlayersPageClient />;
}
