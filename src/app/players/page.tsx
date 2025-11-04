"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Input } from "@heroui/react";
import { Search } from "lucide-react";

import PlayerCreateForm from "@/components/players/PlayerCreateForm";
import PlayerProfileCard from "@/components/players/playerCard";
import { useAllPlayers } from "@/hooks";

export default function PlayersPage() {
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
    mutate,
  } = useAllPlayers();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = useMemo(() => {
    if (playersLoading) return [];
    if (!searchTerm) return playersData;
    const term = searchTerm.toLowerCase();
    return playersData.filter(
      (player) =>
        player.firstName?.toLowerCase().includes(term) ||
        player.lastName?.toLowerCase().includes(term)
    );
  }, [playersData, searchTerm, playersLoading]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search players..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <PlayerCreateForm
          onPlayerCreated={(newPlayer) => {
            mutate([newPlayer, ...(playersData || [])], { revalidate: true });
          }}
        />
      </div>

      {playersLoading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {playersError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{playersError}</p>
        </div>
      )}

      {/* Players Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlayers.length === 0 ? (
          <p>No players found.</p>
        ) : (
          filteredPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="block"
            >
              <PlayerProfileCard player={player} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
