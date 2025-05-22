import Link from "next/link";

import { Card, CardBody, User } from "@heroui/react";

import { getAllPlayers } from "@/lib/db/users";

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="ml-4 mr-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <Link key={player.id} href={`/players/${player.id}`}>
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardBody>
              <User
                name={player.name || "Unnamed Player"}
                description={player.email || ""}
                avatarProps={{
                  showFallback: !player.image,
                  src: player.image || "",
                }}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}
