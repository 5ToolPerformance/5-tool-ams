import { notFound } from "next/navigation";

import PlayerDashboard from "@/components/playerDashboard";
import { getPlayerById } from "@/lib/db/players";

type PlayerPageProps = {
  params: {
    id: string;
  };
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const resolvedParams = params;
  const { id } = resolvedParams;
  const player = await getPlayerById(id);
  console.log("Player data:", player);
  if (!player) return notFound();

  return <PlayerDashboard player={player} />;
}
