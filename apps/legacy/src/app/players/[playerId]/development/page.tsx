import { Suspense } from "react";

import { getEvaluationFormConfig } from "@/application/evaluations/getEvaluationFormConfig";
import { loadPlayerDevelopmentPageData } from "@/application/players/development/loadPlayerDevelopmentPageData";
import { getAuthContext } from "@/application/auth/auth-context";
import { DevelopmentTab } from "@/ui/features/athlete-development/DevelopmentTab";

interface DevelopmentPageProps {
  params: Promise<{ playerId: string }>;
  searchParams: Promise<{ discipline?: string }>;
}

export default async function DevelopmentPage({
  params,
  searchParams,
}: DevelopmentPageProps) {
  const { playerId } = await params;
  const { discipline } = await searchParams;
  const authContext = await getAuthContext();
  const [{ data, routineFormConfig }, evaluationFormConfig] = await Promise.all([
    loadPlayerDevelopmentPageData({
      playerId,
      discipline,
      authContext,
    }),
    getEvaluationFormConfig(),
  ]);

  return (
    <Suspense fallback={<div>Loading development tab...</div>}>
      <DevelopmentTab
        playerId={playerId}
        createdBy={authContext.userId}
        initialPageData={{
          data,
          routineFormConfig,
          evaluationDisciplineOptions: evaluationFormConfig.disciplineOptions,
          evaluationBucketOptions: evaluationFormConfig.bucketOptions,
        }}
        evaluationDisciplineOptions={evaluationFormConfig.disciplineOptions}
        evaluationBucketOptions={evaluationFormConfig.bucketOptions}
      />
    </Suspense>
  );
}
