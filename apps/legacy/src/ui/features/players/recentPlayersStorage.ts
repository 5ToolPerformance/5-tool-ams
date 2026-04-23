const MAX_RECENT_PLAYER_IDS = 10;

function createRecentPlayersStorageKey(userId: string) {
  return `players:recent:${userId}`;
}

export function normalizeRecentPlayerIds(ids: string[]) {
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    deduped.push(id);
    if (deduped.length === MAX_RECENT_PLAYER_IDS) {
      break;
    }
  }

  return deduped;
}

export function upsertRecentPlayerId(existingIds: string[], playerId: string) {
  return normalizeRecentPlayerIds([playerId, ...existingIds]);
}

export function readRecentPlayerIds(userId: string) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const key = createRecentPlayersStorageKey(userId);
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeRecentPlayerIds(parsed.filter((value) => typeof value === "string"));
  } catch {
    return [];
  }
}

export function writeRecentPlayerIds(userId: string, ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const key = createRecentPlayersStorageKey(userId);
  const normalized = normalizeRecentPlayerIds(ids);
  window.localStorage.setItem(key, JSON.stringify(normalized));
}

export function addRecentPlayerId(userId: string, playerId: string) {
  const current = readRecentPlayerIds(userId);
  const next = upsertRecentPlayerId(current, playerId);
  writeRecentPlayerIds(userId, next);
  return next;
}

export function removeRecentPlayerId(userId: string, playerId: string) {
  const current = readRecentPlayerIds(userId);
  const next = current.filter((id) => id !== playerId);
  writeRecentPlayerIds(userId, next);
  return next;
}

export function clearRecentPlayerIds(userId: string) {
  writeRecentPlayerIds(userId, []);
  return [] as string[];
}
