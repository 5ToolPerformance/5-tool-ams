"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@heroui/react";
import { Search } from "lucide-react";

import PlayerCreateForm from "@/components/players/PlayerCreateForm";
import PlayerProfileCard from "@/components/players/playerCard";
import { ApiService } from "@/lib/services/api";
import { PlayerSelect } from "@/types/database";

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        const playerData = await ApiService.fetchAllPlayers();
        setPlayers(playerData);
      } catch (err) {
        console.error("Failed to fetch players:", err);
        setError("Failed to load players. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  console.log(players);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = useMemo(() => {
    if (isLoading) return [];
    if (!searchTerm) return players;
    const term = searchTerm.toLowerCase();
    return players.filter(
      (player) =>
        player.firstName?.toLowerCase().includes(term) ||
        player.lastName?.toLowerCase().includes(term)
    );
  }, [players, searchTerm, isLoading]);

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
            setPlayers((prev) => [newPlayer, ...prev]);
          }}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
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
