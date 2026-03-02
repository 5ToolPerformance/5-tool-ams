import { PlayersForDirectoryQueryResult } from "@/db/queries/players/listPlayersForDirectory";
import { calculateAge } from "@/lib/dates";

import {
  PlayerDirectoryInjuryStatus,
  PlayerDirectoryItem,
  PlayerDirectoryPosition,
} from "./types";

function resolveInjuryStatus(
  hasLimited: boolean,
  hasActive: boolean
): PlayerDirectoryInjuryStatus {
  if (hasLimited) return "limited";
  if (hasActive) return "injured";
  return "none";
}

function resolvePrimaryAndSecondaryPositions(
  rows: PlayersForDirectoryQueryResult["positionRows"],
  legacyPosition: string | null
) {
  if (rows.length === 0) {
    const fallbackPrimary =
      legacyPosition && legacyPosition.trim().length > 0
        ? {
            id: null,
            code: legacyPosition.trim(),
            name: legacyPosition.trim(),
          }
        : null;

    return {
      primaryPosition: fallbackPrimary,
      secondaryPositions: [] as PlayerDirectoryPosition[],
    };
  }

  const primaryRow = rows.find((row) => row.isPrimary) ?? rows[0];
  const secondaryRows = rows.filter((row) => row.positionId !== primaryRow.positionId);

  return {
    primaryPosition: {
      id: primaryRow.positionId,
      code: primaryRow.code,
      name: primaryRow.name,
    },
    secondaryPositions: secondaryRows.map((row) => ({
      id: row.positionId,
      code: row.code,
      name: row.name,
    })),
  };
}

function safeCalculateAge(dateOfBirth: string): number | null {
  const parsed = new Date(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return calculateAge(dateOfBirth);
}

export function normalizePlayersForDirectory(
  queryData: PlayersForDirectoryQueryResult
): PlayerDirectoryItem[] {
  const positionsByPlayer = new Map<string, PlayersForDirectoryQueryResult["positionRows"]>();
  for (const row of queryData.positionRows) {
    const current = positionsByPlayer.get(row.playerId) ?? [];
    current.push(row);
    positionsByPlayer.set(row.playerId, current);
  }

  const injuriesByPlayer = new Map(
    queryData.injurySummaryRows.map((row) => [row.playerId, row] as const)
  );

  return queryData.baseRows.map((row) => {
    const playerPositionRows = positionsByPlayer.get(row.id) ?? [];
    const injurySummary = injuriesByPlayer.get(row.id);
    const { primaryPosition, secondaryPositions } =
      resolvePrimaryAndSecondaryPositions(playerPositionRows, row.legacyPosition);

    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      age: safeCalculateAge(row.dateOfBirth),
      dateOfBirth: row.dateOfBirth,
      sport: row.sport,
      throws: row.throws,
      hits: row.hits,
      prospect: row.prospect,
      primaryCoachId: row.primaryCoachId,
      createdAt: row.createdAt,
      primaryPosition,
      secondaryPositions,
      injuryStatus: resolveInjuryStatus(
        injurySummary?.hasLimited ?? false,
        injurySummary?.hasActive ?? false
      ),
      injuryActiveCount: injurySummary?.activeCount ?? 0,
    };
  });
}
