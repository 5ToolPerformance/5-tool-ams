export function resolveSelectedPortalPlayerId(
  playerIds: string[],
  requestedPlayerId?: string | null
) {
  if (requestedPlayerId && playerIds.includes(requestedPlayerId)) {
    return requestedPlayerId;
  }

  return playerIds[0] ?? null;
}

export function resolveClientInviteStatus(
  status: "pending" | "accepted" | "expired" | "revoked",
  expiresAt: Date,
  now = new Date()
) {
  if (status === "pending" && expiresAt < now) {
    return "expired" as const;
  }

  return status;
}

export function assertPortalInviteUserIsExternal(
  role: "player" | "coach" | "admin" | null | undefined
) {
  if (role) {
    throw new Error("Internal users cannot accept client portal invites");
  }
}

