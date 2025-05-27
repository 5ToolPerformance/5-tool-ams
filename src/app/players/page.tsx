import Link from "next/link";

import PlayerProfileCard from "@/components/players/playerCard";
import { getAllPlayers } from "@/lib/db/players";

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="ml-4 mr-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <Link key={player.id} href={`/players/${player.id}`}>
          <PlayerProfileCard player={player} />
        </Link>
      ))}
    </div>
  );
}
