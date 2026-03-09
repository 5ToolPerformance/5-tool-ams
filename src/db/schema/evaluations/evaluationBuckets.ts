import {
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { buckets } from "@/db/schema/config/buckets";
import { evaluations } from "@/db/schema/evaluations/evaluations";

export const evaluationBucketStatusEnum = pgEnum("evaluation_bucket_status", [
  "strength",
  "developing",
  "constraint",
  "not_relevant",
]);

export const evaluationBuckets = pgTable(
  "evaluation_buckets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),

    bucketId: uuid("bucket_id")
      .notNull()
      .references(() => buckets.id, { onDelete: "no action" }),

    status: evaluationBucketStatusEnum("status").notNull(),

    notes: text("notes"),
  },
  (t) => [
    index("evaluation_buckets_evaluation_idx").on(t.evaluationId),
    uniqueIndex("evaluation_buckets_eval_bucket_uidx").on(
      t.evaluationId,
      t.bucketId
    ),
  ]
);
