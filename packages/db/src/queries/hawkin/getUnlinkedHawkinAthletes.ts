import { and, eq, isNull, sql } from "drizzle-orm";

import db from "@/db";
import { externalAthleteIds } from "@/db/schema";

const hawkinAthletesUnion = sql`
  (
    SELECT
      athlete_id   AS "athleteId",
      athlete_name AS "athleteName",
      timestamp
    FROM hawkins_cmj

    UNION ALL

    SELECT
      athlete_id   AS "athleteId",
      athlete_name AS "athleteName",
      timestamp
    FROM hawkins_drop_jump

    UNION ALL

    SELECT
      athlete_id   AS "athleteId",
      athlete_name AS "athleteName",
      timestamp
    FROM hawkins_iso

    UNION ALL

    SELECT
      athlete_id   AS "athleteId",
      athlete_name AS "athleteName",
      timestamp
    FROM hawkins_multi

    UNION ALL

    SELECT
      athlete_id   AS "athleteId",
      athlete_name AS "athleteName",
      timestamp
    FROM hawkins_ts_iso
  ) AS hawkin_athletes
`;

export async function getUnlinkedHawkinAthletes() {
  const results = await db
    .select({
      athleteId: sql<string>`hawkin_athletes."athleteId"`,
      athleteName: sql<string | null>`MAX(hawkin_athletes."athleteName")`,
      lastSeenAt: sql<string>`MAX(hawkin_athletes.timestamp)`,
      rowCount: sql<number>`COUNT(*)`,
    })
    .from(hawkinAthletesUnion)
    .leftJoin(
      externalAthleteIds,
      and(
        eq(externalAthleteIds.externalSystem, "hawkin"),
        eq(
          externalAthleteIds.externalId,
          sql<string>`hawkin_athletes."athleteId"`
        )
      )
    )
    .where(isNull(externalAthleteIds.id))
    .groupBy(sql`hawkin_athletes."athleteId"`)
    .orderBy(sql`MAX(hawkin_athletes.timestamp) DESC`);

  return results;
}
