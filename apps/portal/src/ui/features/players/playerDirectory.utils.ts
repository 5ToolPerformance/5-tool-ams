import {
  PlayerDirectoryFiltersState,
  PlayerDirectoryItem,
  PlayerDirectorySortKey,
  PlayerDirectorySortOrder,
} from "@ams/domain/player/directory";

export function calculatePlayerAge(dateOfBirth: string | null | undefined) {
  if (!dateOfBirth) {
    return null;
  }

  const parsed = new Date(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const monthDiff = today.getMonth() - parsed.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsed.getDate())) {
    age -= 1;
  }

  return age;
}

export function hasActiveDirectoryFilters(filters: PlayerDirectoryFiltersState) {
  return (
    filters.searchTerm.trim().length > 0 ||
    Boolean(filters.ageFilter) ||
    Boolean(filters.positionFilter) ||
    Boolean(filters.injuryStatusFilter) ||
    Boolean(filters.prospectFilter)
  );
}

export function applyPlayerDirectoryFilters(
  players: PlayerDirectoryItem[],
  filters: PlayerDirectoryFiltersState
) {
  const normalizedSearch = filters.searchTerm.trim().toLowerCase();

  return players.filter((player) => {
    if (normalizedSearch) {
      const firstName = player.firstName.toLowerCase();
      const lastName = player.lastName.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      if (
        !firstName.includes(normalizedSearch) &&
        !lastName.includes(normalizedSearch) &&
        !fullName.includes(normalizedSearch)
      ) {
        return false;
      }
    }

    if (filters.ageFilter && String(player.age ?? "") !== filters.ageFilter) {
      return false;
    }

    if (filters.positionFilter) {
      const primaryMatches = player.primaryPosition?.id === filters.positionFilter;
      const secondaryMatches = player.secondaryPositions.some(
        (position) => position.id === filters.positionFilter
      );
      if (!primaryMatches && !secondaryMatches) {
        return false;
      }
    }

    if (
      filters.injuryStatusFilter &&
      player.injuryStatus !== filters.injuryStatusFilter
    ) {
      return false;
    }

    if (filters.prospectFilter === "prospect" && !player.prospect) {
      return false;
    }
    if (filters.prospectFilter === "nonProspect" && player.prospect) {
      return false;
    }

    return true;
  });
}

export function sortPlayerDirectoryItems(
  players: PlayerDirectoryItem[],
  sortBy: PlayerDirectorySortKey,
  sortOrder: PlayerDirectorySortOrder
) {
  return [...players].sort((left, right) => {
    let leftValue: string | number = "";
    let rightValue: string | number = "";

    if (sortBy === "age") {
      leftValue = left.age ?? -1;
      rightValue = right.age ?? -1;
    } else {
      leftValue = (left[sortBy] ?? "").toLowerCase();
      rightValue = (right[sortBy] ?? "").toLowerCase();
    }

    if (leftValue < rightValue) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (leftValue > rightValue) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
}

export function buildPositionFilterOptions(players: PlayerDirectoryItem[]) {
  const seen = new Map<string, string>();

  for (const player of players) {
    const allPositions = [
      ...(player.primaryPosition ? [player.primaryPosition] : []),
      ...player.secondaryPositions,
    ];

    for (const position of allPositions) {
      if (!position.id) {
        continue;
      }

      if (!seen.has(position.id)) {
        seen.set(position.id, `${position.code} - ${position.name}`);
      }
    }
  }

  return [...seen.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function buildAgeFilterOptions(players: PlayerDirectoryItem[]) {
  const ages = new Set<number>();

  for (const player of players) {
    if (typeof player.age === "number") {
      ages.add(player.age);
    }
  }

  return [...ages].sort((a, b) => a - b);
}

