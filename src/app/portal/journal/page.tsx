import { getClientPortalContext } from "@/application/client-portal/service";
import { getClientAccessForPlayer } from "@/application/client-portal/service";
import { assertCanViewPortalJournalPlayer } from "@/application/journal/access";
import { listJournalEntriesForPlayer } from "@/application/journal/listJournalEntriesForPlayer";
import type { JournalFeedFilter } from "@/domain/journal/types";
import { requireClientPortalAccess } from "@/lib/auth/client-auth";
import { PortalPlayerSwitcher } from "@/ui/features/client-portal/PortalPlayerSwitcher";
import { JournalPageClient } from "@/ui/features/client-portal/journal/JournalPageClient";

export default async function PortalJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string; filter?: JournalFeedFilter }>;
}) {
  const authContext = await requireClientPortalAccess();
  const { playerId, filter } = await searchParams;
  const context = await getClientPortalContext(
    authContext.userId,
    authContext.facilityId,
    playerId
  );
  const selectedPlayer = context.players.find((player) => player.id === context.selectedPlayerId);

  if (!selectedPlayer) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-5">
        <PortalPlayerSwitcher players={context.players} selectedPlayerId={context.selectedPlayerId} />
      </div>
    );
  }

  await assertCanViewPortalJournalPlayer({
    userId: authContext.userId,
    facilityId: authContext.facilityId,
    playerId: selectedPlayer.id,
  });

  const [access, entries] = await Promise.all([
    getClientAccessForPlayer(authContext.userId, authContext.facilityId, selectedPlayer.id),
    listJournalEntriesForPlayer({
      playerId: selectedPlayer.id,
      facilityId: authContext.facilityId,
      filter: filter ?? "all",
      limit: 15,
    }),
  ]);

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-5 sm:max-w-2xl">
      <PortalPlayerSwitcher players={context.players} selectedPlayerId={context.selectedPlayerId} />
      <JournalPageClient
        playerId={selectedPlayer.id}
        playerName={selectedPlayer.fullName}
        entries={entries}
        selectedFilter={filter ?? "all"}
        canLogActivity={Boolean(access?.permissions.canLogActivity)}
      />
    </div>
  );
}

