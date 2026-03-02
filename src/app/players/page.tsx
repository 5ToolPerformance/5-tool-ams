import { redirect } from "next/navigation";

import { getPlayersDirectoryData } from "@/application/players/directory/getPlayersDirectoryData";
import { getAuthContext } from "@/lib/auth/auth-context";
import PlayersPageClient from "@/ui/features/players/PlayersPageClient";

export default async function PlayersPage() {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/training`);
    }
    redirect("/profile");
  }

  const { players, currentUserId } = await getPlayersDirectoryData(
    ctx.facilityId,
    ctx.userId
  );

  return <PlayersPageClient players={players} currentUserId={currentUserId} />;
}
