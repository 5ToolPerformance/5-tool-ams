"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { useAllPlayers } from "@/hooks";
import { CreatePlayerConfigModal } from "@/ui/core/athletes/CreatePlayerConfigModal";

type SortKey = "firstName" | "lastName" | "age";
type SortOrder = "asc" | "desc";

// Helper function to calculate age from date of birth
function calculateAge(
  dateOfBirth: string | Date | null | undefined
): number | null {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

export default function PlayersPage() {
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
    mutate,
  } = useAllPlayers();

  const playersArray = Array.isArray(playersData) ? playersData : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortKey>("lastName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Enhance players data with calculated age
  const playersWithAge = useMemo(() => {
    return playersArray.map((player) => ({
      ...player,
      calculatedAge: calculateAge(player.date_of_birth),
    }));
  }, [playersArray]);

  // Get unique age groups for filtering
  const ageGroups = useMemo(() => {
    const ages: number[] = playersWithAge
      .map((p) => p.calculatedAge)
      .filter((age): age is number => age != null);

    return Array.from(new Set(ages)).sort((a, b) => a - b);
  }, [playersWithAge]);

  const filteredAndSortedPlayers = useMemo(() => {
    if (playersLoading) return [];

    let filtered = playersWithAge;

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (player) =>
          player.firstName?.toLowerCase().includes(term) ||
          player.lastName?.toLowerCase().includes(term)
      );
    }

    // Age filter
    if (ageFilter) {
      filtered = filtered.filter(
        (player) => player.calculatedAge?.toString() === ageFilter
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortBy === "age") {
        aVal = a.calculatedAge ?? -1;
        bVal = b.calculatedAge ?? -1;
      } else {
        aVal = (a[sortBy] ?? "").toLowerCase();
        bVal = (b[sortBy] ?? "").toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    playersWithAge,
    searchTerm,
    ageFilter,
    sortBy,
    sortOrder,
    playersLoading,
  ]);

  const activeFiltersCount = [searchTerm, ageFilter].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm("");
    setAgeFilter("");
  };

  return (
    <div className="container mx-auto px-4 py-6 text-gray-900 dark:text-gray-100">
      {/* Top Bar */}
      <div className="mb-6 flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Players
          </h1>
          <CreatePlayerConfigModal
            trigger={<Button>Create Player</Button>}
            onSuccess={mutate}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="Search by first or last name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant={showFilters ? "solid" : "bordered"}
            onPress={() => setShowFilters(!showFilters)}
            startContent={<SlidersHorizontal className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Filters
            {activeFiltersCount > 0 && (
              <Chip size="sm" color="primary" variant="flat">
                {activeFiltersCount}
              </Chip>
            )}
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Filter Options</h3>
              {activeFiltersCount > 0 && (
                <Button
                  size="sm"
                  variant="light"
                  onPress={clearFilters}
                  startContent={<X className="h-3 w-3" />}
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label="Age"
                placeholder="All ages"
                selectedKeys={ageFilter ? new Set([ageFilter]) : new Set()}
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                {ageGroups.map((age) => (
                  <SelectItem key={age.toString()}>{age} years old</SelectItem>
                ))}
              </Select>

              <Select
                label="Sort by"
                selectedKeys={new Set([sortBy])}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <SelectItem key="firstName">First Name</SelectItem>
                <SelectItem key="lastName">Last Name</SelectItem>
                <SelectItem key="age">Age</SelectItem>
              </Select>

              <Select
                label="Order"
                selectedKeys={new Set([sortOrder])}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              >
                <SelectItem key="asc">Ascending</SelectItem>
                <SelectItem key="desc">Descending</SelectItem>
              </Select>
            </div>
          </div>
        )}
      </div>

      {playersLoading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent dark:border-gray-500"></div>
        </div>
      )}

      {playersError && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/40">
          <p className="text-sm text-red-700 dark:text-red-200">
            {playersError}
          </p>
        </div>
      )}

      {!playersLoading && !playersError && (
        <>
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedPlayers.length} of {playersArray.length}{" "}
            players
          </div>

          {/* Players Table */}
          <div className="bg-white shadow-sm dark:bg-gray-900">
            <Table aria-label="Players table">
              <TableHeader>
                <TableColumn>FIRST NAME</TableColumn>
                <TableColumn>LAST NAME</TableColumn>
                <TableColumn>PROSPECT</TableColumn>
                <TableColumn>AGE</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No players found. Try adjusting your filters.
                  </div>
                }
              >
                {filteredAndSortedPlayers.map((player) => (
                  <TableRow
                    key={player.id}
                    as={Link}
                    href={`/players/${player.id}/training`}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="font-medium">
                      {player.firstName || "—"}
                    </TableCell>
                    <TableCell>{player.lastName || "—"}</TableCell>
                    <TableCell>
                      {player.prospect ? (
                        <Chip size="sm" color="success" variant="flat">
                          Prospect
                        </Chip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {player.calculatedAge !== null ? (
                        <Chip size="sm" variant="flat">
                          {player.calculatedAge}
                        </Chip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
