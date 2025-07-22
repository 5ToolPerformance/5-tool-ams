import Link from "next/link";

import PlayerProfileCard from "@/components/players/playerCard";
import { PlayerService } from "@/lib/services/players";
import { PlayerSelect } from "@/types/database";

export default async function PlayersPage() {
  const players = await PlayerService.getAllPlayersWithInformation();
  console.log(players);

  return (
    <div className="ml-4 mr-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {players.map((player: PlayerSelect) => (
        <Link key={player.id} href={`/players/${player.id}`}>
          <PlayerProfileCard player={player} />
        </Link>
      ))}
    </div>
  );
}
