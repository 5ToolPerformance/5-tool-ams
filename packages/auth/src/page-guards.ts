import { notFound, redirect } from "next/navigation";

import type { AuthContext } from "./auth-context";

export type PageGuardsDependencies = {
  getAuthContext: () => Promise<AuthContext>;
};

export function createPageGuardsApi({ getAuthContext }: PageGuardsDependencies) {
  async function requirePlayerRouteAccess(playerId: string) {
    const ctx = await getAuthContext();

    if (ctx.role === "player" && ctx.playerId !== playerId) {
      notFound();
    }

    return ctx;
  }

  async function requireNonPlayerForAdminArea() {
    const ctx = await getAuthContext();
    if (ctx.role === "player") {
      if (ctx.playerId) {
        redirect(`/players/${ctx.playerId}/overview`);
      }
      redirect("/profile");
    }
    return ctx;
  }

  return {
    requirePlayerRouteAccess,
    requireNonPlayerForAdminArea,
  };
}
