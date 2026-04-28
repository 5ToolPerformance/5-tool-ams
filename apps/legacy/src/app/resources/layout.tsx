import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthContext } from "@/application/auth/auth-context";
import { ResourcesPageShell } from "@/ui/features/resources/ResourcesPageShell";
import { ResourcesTabsController } from "@/ui/features/resources/ResourcesTabsController";

interface ResourcesLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

export default async function ResourcesLayout({
  children,
}: ResourcesLayoutProps) {
  const ctx = await getAuthContext();

  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }

  return (
    <ResourcesPageShell>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Resources</h1>
        <p className="text-default-500">
          Shared drills, mechanics, routines, and internal reference material for coaches.
        </p>
      </div>
      <ResourcesTabsController />
      <div className="space-y-6 pt-2">{children}</div>
    </ResourcesPageShell>
  );
}
