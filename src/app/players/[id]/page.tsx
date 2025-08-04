import { notFound } from "next/navigation";

import { auth } from "@/auth";
import PlayerDashboard from "@/components/playerDashboard";
import { PlayerService } from "@/lib/services/players";
import { PageProps } from "@/types/page";

type PlayerPageProps = PageProps<{ id: string }>;

export default async function PlayerPage({ params }: PlayerPageProps) {
  const session = await auth();
  if (!session) return notFound();

  let coachId: string | undefined = undefined;
  if (session.user.role === "coach") {
    coachId = session.user.id;
  }
  const { id } = await params;
  const player = await PlayerService.getPlayerById(id);
  if (!player) return notFound();

  return <PlayerDashboard player={player} coachId={coachId} />;
}
