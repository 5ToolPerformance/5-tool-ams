import { and, gte, isNull, lte, or } from "drizzle-orm";

import { injury } from "@/db/schema";

export function injuriesOverlapDate(date: string) {
  return and(
    lte(injury.startDate, date),
    or(isNull(injury.endDate), gte(injury.endDate, date))
  );
}
