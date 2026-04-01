import { Card, CardBody } from "@heroui/react";

import { getClientPortalContext } from "@/application/client-portal/service";
import { requireClientPortalAccess } from "@/lib/auth/client-auth";
import { PortalPlayerSwitcher } from "@/ui/features/client-portal/PortalPlayerSwitcher";

export default async function PortalJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>;
}) {
  const authContext = await requireClientPortalAccess();
  const { playerId } = await searchParams;
  const context = await getClientPortalContext(
    authContext.userId,
    authContext.facilityId,
    playerId
  );
  const selectedPlayer = context.players.find((player) => player.id === context.selectedPlayerId);

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-5">
      <PortalPlayerSwitcher players={context.players} selectedPlayerId={context.selectedPlayerId} />
      <Card className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-default-100/70">
        <CardBody className="space-y-3 p-5">
          <h1 className="text-2xl font-semibold">Journal</h1>
          <p className="text-sm text-default-500">
            Journaling features are coming soon{selectedPlayer ? ` for ${selectedPlayer.fullName}` : ""}.
          </p>
          <p className="text-sm text-default-500">
            This area will let families log reflections, updates, and development notes.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

