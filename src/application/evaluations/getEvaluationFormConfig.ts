import { listActiveBuckets } from "@/db/queries/config/listActiveBuckets";
import { listActiveDisciplines } from "@/db/queries/config/listActiveDisciplines";

export type EvaluationFormDisciplineOption = Awaited<
  ReturnType<typeof listActiveDisciplines>
>[number];

export type EvaluationFormBucketOption = Awaited<
  ReturnType<typeof listActiveBuckets>
>[number];

export type EvaluationFormConfig = {
  disciplineOptions: EvaluationFormDisciplineOption[];
  bucketOptions: EvaluationFormBucketOption[];
};

export async function getEvaluationFormConfig(): Promise<EvaluationFormConfig> {
  const [disciplineOptions, bucketOptions] = await Promise.all([
    listActiveDisciplines(),
    listActiveBuckets(),
  ]);

  return {
    disciplineOptions,
    bucketOptions,
  };
}
