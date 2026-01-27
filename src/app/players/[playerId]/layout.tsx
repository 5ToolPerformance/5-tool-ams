// app/players/[playerId]/overview/page.tsx
import { ReactNode } from "react";

import { getPlayerHeader } from "@/db/queries/players/PlayerHeader";
import { AthleteHeader } from "@/ui/core/athletes/AthleteHeader";
import { AthleteHeaderMeta } from "@/ui/core/athletes/AthleteHeaderMeta";
import { AthletePageShell } from "@/ui/core/athletes/AthletePageShell";
import { AthleteQuickActions } from "@/ui/core/athletes/AthleteQuickActions";
import { AthleteStatusBadges } from "@/ui/core/athletes/AthleteStatusBadge";
import { AthleteTabsController } from "@/ui/core/athletes/AthleteTabsController";
import { TabContentShell } from "@/ui/core/athletes/TabContentShell";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

interface PlayerLayoutProps {
  params: {
    playerId: string;
  };
  children: ReactNode;
}

export default async function PlayerLayout({
  params,
  children,
}: PlayerLayoutProps) {
  const { playerId } = await params;
  const player = await getPlayerHeader(playerId);
  const name = `${player.firstName} ${player.lastName}`;
  const handedness = `${player.handedness.bat ?? "?"}/${player.handedness.throw ?? "?"}`;
  const roles =
    player.positions.length > 0
      ? player.positions.map((p) => p.name).join(" / ")
      : undefined;
  const statuses = [player.status.injuryFlag ? "Injured" : "Active"];

  return (
    <AthletePageShell>
      {/* ------------------------------------------------------------------ */}
      {/* Player Header (blocks render, correct)                              */}
      {/* ------------------------------------------------------------------ */}
      <AthleteHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <AthleteHeaderMeta
              name={name}
              age={player.age}
              handedness={handedness}
              roles={roles}
            />
            <AthleteStatusBadges statuses={statuses} />
          </div>

          <AthleteQuickActions canEdit playerId={player.id} />
        </div>
      </AthleteHeader>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs (client-controlled)                                           */}
      {/* ------------------------------------------------------------------ */}
      <AthleteTabsController />

      {/* ------------------------------------------------------------------ */}
      {/* Tab Content                                                        */}
      {/* ------------------------------------------------------------------ */}
      <TabContentShell>{children}</TabContentShell>
    </AthletePageShell>
  );
}
