// app/players/[playerId]/overview/page.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";

import { getPlayerHeader } from "@/db/queries/players/PlayerHeader";
import { requirePlayerRouteAccess } from "@/lib/auth/page-guards";
import { toHandednessAbbrev } from "@/lib/utils/handedness";
import { AthleteHeader } from "@/ui/core/athletes/AthleteHeader";
import { AthleteHeaderMeta } from "@/ui/core/athletes/AthleteHeaderMeta";
import { AthletePageShell } from "@/ui/core/athletes/AthletePageShell";
import { AthleteQuickActions } from "@/ui/core/athletes/AthleteQuickActions";
import {
  AthleteHeaderStatus,
  AthleteStatusBadges,
} from "@/ui/core/athletes/AthleteStatusBadge";
import { AthleteTabsController } from "@/ui/core/athletes/AthleteTabsController";
import { TabContentShell } from "@/ui/core/athletes/TabContentShell";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

interface PlayerLayoutProps {
  params: Promise<{
    playerId: string;
  }>;
  children: ReactNode;
}

export default async function PlayerLayout({
  params,
  children,
}: PlayerLayoutProps) {
  const { playerId } = await params;
  await requirePlayerRouteAccess(playerId);

  const player = await getPlayerHeader(playerId);
  if (!player) {
    notFound();
  }

  const name = `${player.firstName} ${player.lastName}`;
  const handedness = `${toHandednessAbbrev(player.handedness.bat) ?? "?"}/${toHandednessAbbrev(player.handedness.throw) ?? "?"}`;
  const roles =
    player.positions.length > 0
      ? player.positions.map((p) => p.name).join(" / ")
      : undefined;
  const statusLabelByLevel: Record<
    "soreness" | "injury" | "diagnosis",
    AthleteHeaderStatus
  > = {
    soreness: "Soreness",
    injury: "Injury",
    diagnosis: "Diagnosed Injury",
  };
  const statuses: AthleteHeaderStatus[] = player.status.activeInjuryLevel
    ? [statusLabelByLevel[player.status.activeInjuryLevel]]
    : ["Active"];

  return (
    <AthletePageShell>
      {/* ------------------------------------------------------------------ */}
      {/* Player Header (blocks render, correct)                              */}
      {/* ------------------------------------------------------------------ */}
      <AthleteHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <AthleteHeaderMeta
              name={name}
              age={player.age}
              handedness={handedness}
              roles={roles}
              primaryCoachName={player.primaryCoachName}
            />
            <AthleteStatusBadges statuses={statuses} />
          </div>

          <AthleteQuickActions canEdit player={player} />
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
