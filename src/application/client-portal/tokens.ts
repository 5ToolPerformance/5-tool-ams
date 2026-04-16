import { createHash, randomBytes } from "crypto";

export function createClientInviteToken() {
  const token = randomBytes(32).toString("hex");

  return {
    token,
    tokenHash: hashClientInviteToken(token),
  };
}

export function hashClientInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

