import { DB } from "@/db";
import { getActivePlayerInjuries } from "@/db/queries/injuries/getActivePlayerInjuries";

export async function getPlayerInjurySummary(db: DB, playerId: string) {
  const injuries = await getActivePlayerInjuries(db, playerId);

  return {
    hasActive: injuries.length > 0,
    hasLimited: injuries.some((i) => i.status === "limited"),
    count: injuries.length,
  };
}
