import { notFound } from "next/navigation";

import PlayerDashboard from "@/components/playerDashboard";
import { getPlayerById } from "@/lib/db/players";

type PlayerPageProps = {
  params: {
    id: string;
  };
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const player = await getPlayerById(id);
  if (!player) return notFound();

  return <PlayerDashboard player={player} />;
}
