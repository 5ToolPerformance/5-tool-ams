import { and, asc, eq, gte, lte } from "drizzle-orm";

import db from "@/db";
import { throwingWorkloadDailySummaries } from "@/db/schema";

export async function getThrowingSummaryForRange(params: {
  playerId: string;
  startDate: string;
  endDate: string;
}) {
  const { playerId, startDate, endDate } = params;

  return db
    .select()
    .from(throwingWorkloadDailySummaries)
    .where(
      and(
        eq(throwingWorkloadDailySummaries.playerId, playerId),
        gte(throwingWorkloadDailySummaries.summaryDate, startDate),
        lte(throwingWorkloadDailySummaries.summaryDate, endDate)
      )
    )
    .orderBy(asc(throwingWorkloadDailySummaries.summaryDate));
}
