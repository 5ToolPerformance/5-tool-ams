import { notFound, redirect } from "next/navigation";

import { getAuthContext } from "./auth-context";

export async function requirePlayerRouteAccess(playerId: string) {
  const ctx = await getAuthContext();

  if (ctx.role === "player" && ctx.playerId !== playerId) {
    notFound();
  }

  return ctx;
}

export async function requireNonPlayerForAdminArea() {
  const ctx = await getAuthContext();
  if (ctx.role === "player") {
    if (ctx.playerId) {
      redirect(`/players/${ctx.playerId}/overview`);
    }
    redirect("/profile");
  }
  return ctx;
}
