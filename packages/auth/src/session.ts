export type SessionUserLike = {
  id?: string | null;
  email?: string | null;
  issuer?: "ams" | "portal" | null;
};

export type SessionLike = {
  user?: SessionUserLike | null;
} | null;

export type SessionGetter = () => Promise<SessionLike>;
