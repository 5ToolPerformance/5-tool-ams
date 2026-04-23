import { buildJournalListItem } from "@ams/domain/journal/serializers";
import { getJournalEntriesForPlayer } from "@ams/db/queries/journal/getJournalEntriesForPlayer";
import { getJournalEntryDetail } from "./getJournalEntryDetail";
import type { JournalFeedFilter, JournalEntryListItem } from "@ams/domain/journal/types";

export async function listJournalEntriesForPlayer(params: {
  playerId: string;
  facilityId: string;
  filter?: JournalFeedFilter;
  limit?: number;
}): Promise<JournalEntryListItem[]> {
  const rows = await getJournalEntriesForPlayer(params);
  const details = await Promise.all(rows.map((row) => getJournalEntryDetail(row.id)));
  return details.filter((detail): detail is NonNullable<typeof detail> => detail !== null).map(buildJournalListItem);
}
