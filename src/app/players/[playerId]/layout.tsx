// app/players/[playerId]/overview/page.tsx
import { ReactNode } from "react";

import { AthleteHeader } from "@/ui/core/athletes/AthleteHeader";
import { AthleteHeaderMeta } from "@/ui/core/athletes/AthleteHeaderMeta";
import { AthletePageShell } from "@/ui/core/athletes/AthletePageShell";
import { AthleteQuickActions } from "@/ui/core/athletes/AthleteQuickActions";
import { AthleteStatusBadges } from "@/ui/core/athletes/AthleteStatusBadge";
import { AthleteTabsController } from "@/ui/core/athletes/AthleteTabsController";
import { TabContentShell } from "@/ui/core/athletes/TabContentShell";

// -----------------------------------------------------------------------------
// Fake data (replace later with real loaders)
// -----------------------------------------------------------------------------

async function getFakePlayer(id: string) {
  return {
    id: id,
    name: "John Doe",
    age: 16,
    handedness: "R/R",
    roles: "OF / RHP",
    statuses: ["Active"],
    canEdit: true,
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

interface PlayerLayoutProps {
  params: {
    id: string;
  };
  children: ReactNode;
}

export default async function PlayerLayout({
  params,
  children,
}: PlayerLayoutProps) {
  const player = await getFakePlayer(params.id);

  return (
    <AthletePageShell>
      {/* ------------------------------------------------------------------ */}
      {/* Player Header (blocks render, correct)                              */}
      {/* ------------------------------------------------------------------ */}
      <AthleteHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <AthleteHeaderMeta
              name={player.name}
              age={player.age}
              handedness={player.handedness}
              roles={player.roles}
            />
            <AthleteStatusBadges statuses={player.statuses} />
          </div>

          <AthleteQuickActions canEdit={player.canEdit} />
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
