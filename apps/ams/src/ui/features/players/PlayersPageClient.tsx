"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@heroui/react";

import {
  PlayerDirectoryFiltersState,
  PlayerDirectoryItem,
} from "@ams/domain/player/directory";
import { CreatePlayerConfigModal } from "@/ui/core/athletes/CreatePlayerConfigModal";

import { PlayerDirectoryFilters } from "./PlayerDirectoryFilters";
import { PlayerSectionTable } from "./PlayerSectionTable";
import { RecentPlayersChips } from "./RecentPlayersChips";
import {
  addRecentPlayerId,
  clearRecentPlayerIds,
  readRecentPlayerIds,
  removeRecentPlayerId,
} from "./recentPlayersStorage";
import {
  applyPlayerDirectoryFilters,
  buildAgeFilterOptions,
  buildPositionFilterOptions,
  hasActiveDirectoryFilters,
  sortPlayerDirectoryItems,
} from "./playerDirectory.utils";

interface PlayersPageClientProps {
  players: PlayerDirectoryItem[];
  currentUserId: string;
}

const DEFAULT_FILTERS: PlayerDirectoryFiltersState = {
  searchTerm: "",
  ageFilter: "",
  positionFilter: "",
  injuryStatusFilter: "",
  prospectFilter: "",
  sortBy: "lastName",
  sortOrder: "asc",
};

export default function PlayersPageClient({
  players,
  currentUserId,
}: PlayersPageClientProps) {
  const router = useRouter();

  const [filters, setFilters] = useState<PlayerDirectoryFiltersState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [recentPlayerIds, setRecentPlayerIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentPlayerIds(readRecentPlayerIds(currentUserId));
  }, [currentUserId]);

  const activeFilters = hasActiveDirectoryFilters(filters);
  const activeFiltersCount = [
    filters.searchTerm.trim(),
    filters.ageFilter,
    filters.positionFilter,
    filters.injuryStatusFilter,
    filters.prospectFilter,
  ].filter(Boolean).length;

  const ageOptions = useMemo(() => buildAgeFilterOptions(players), [players]);
  const positionOptions = useMemo(
    () => buildPositionFilterOptions(players),
    [players]
  );

  const filteredPlayers = useMemo(
    () => applyPlayerDirectoryFilters(players, filters),
    [players, filters]
  );
  const filteredAndSortedPlayers = useMemo(
    () => sortPlayerDirectoryItems(filteredPlayers, filters.sortBy, filters.sortOrder),
    [filteredPlayers, filters.sortBy, filters.sortOrder]
  );

  const myPlayers = useMemo(
    () =>
      filteredAndSortedPlayers.filter(
        (player) => player.primaryCoachId === currentUserId
      ),
    [filteredAndSortedPlayers, currentUserId]
  );

  const recentPlayers = useMemo(() => {
    const byId = new Map(players.map((player) => [player.id, player] as const));
    return recentPlayerIds.map((id) => byId.get(id)).filter(Boolean) as PlayerDirectoryItem[];
  }, [players, recentPlayerIds]);

  function openPlayer(playerId: string) {
    const nextRecent = addRecentPlayerId(currentUserId, playerId);
    setRecentPlayerIds(nextRecent);
    router.push(`/players/${playerId}/training`);
  }

  function removeRecent(playerId: string) {
    const nextRecent = removeRecentPlayerId(currentUserId, playerId);
    setRecentPlayerIds(nextRecent);
  }

  function clearAllRecent() {
    const nextRecent = clearRecentPlayerIds(currentUserId);
    setRecentPlayerIds(nextRecent);
  }

  function clearFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  }

  return (
    <div className="container mx-auto flex min-h-full flex-col gap-6 px-4 py-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Players</h1>
        <CreatePlayerConfigModal
          trigger={
            <Button color="default" variant="bordered">
              Create Player
            </Button>
          }
          onSuccess={() => router.refresh()}
        />
      </div>

      <PlayerDirectoryFilters
        filters={filters}
        showFilters={showFilters}
        activeFiltersCount={activeFiltersCount}
        ageOptions={ageOptions}
        positionOptions={positionOptions}
        onSearchChange={(searchTerm) => setFilters((current) => ({ ...current, searchTerm }))}
        onAgeFilterChange={(ageFilter) => setFilters((current) => ({ ...current, ageFilter }))}
        onPositionFilterChange={(positionFilter) =>
          setFilters((current) => ({ ...current, positionFilter }))
        }
        onInjuryStatusFilterChange={(injuryStatusFilter) =>
          setFilters((current) => ({ ...current, injuryStatusFilter }))
        }
        onProspectFilterChange={(prospectFilter) =>
          setFilters((current) => ({ ...current, prospectFilter }))
        }
        onSortByChange={(sortBy) => setFilters((current) => ({ ...current, sortBy }))}
        onSortOrderChange={(sortOrder) =>
          setFilters((current) => ({ ...current, sortOrder }))
        }
        onToggleExpandedFilters={() => setShowFilters((current) => !current)}
        onClearFilters={clearFilters}
      />

      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing {filteredAndSortedPlayers.length} of {players.length} players
      </div>

      <div className="space-y-6">
        {!activeFilters && (
          <RecentPlayersChips
            players={recentPlayers}
            onOpenPlayer={openPlayer}
            onRemovePlayer={removeRecent}
            onClearAll={clearAllRecent}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-1">
          <PlayerSectionTable
            className="min-h-0"
            scrollHeightClassName="h-64"
            title="My Players"
            players={myPlayers}
            emptyMessage="No players are assigned to you with the active filters."
            onOpenPlayer={openPlayer}
          />

          <PlayerSectionTable
            className="min-h-0"
            scrollHeightClassName="h-[28rem]"
            title="All Players"
            players={filteredAndSortedPlayers}
            emptyMessage="No players found. Try adjusting your filters."
            onOpenPlayer={openPlayer}
          />
        </div>
      </div>
    </div>
  );
}
