import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";

import PlayerDashboard from "@/components/playerDashboard";
import options from "@/config/auth";
import { PlayerService } from "@/lib/services/players";

type PlayerPageProps = {
  params: {
    id: string;
  };
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const session = await getServerSession(options);
  if (!session) return notFound();

  let coachId: string | undefined = undefined;
  if (session.user.role === "coach") {
    coachId = session.user.id;
  }
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const player = await PlayerService.getPlayerById(id);
  if (!player) return notFound();

  return <PlayerDashboard player={player} coachId={coachId} />;
}
