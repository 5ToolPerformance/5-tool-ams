import { Suspense } from "react";

import { getEvaluationFormConfig } from "@/application/evaluations/getEvaluationFormConfig";
import { getPlayerDevelopmentTabData } from "@/application/players/development";
import { getAuthContext } from "@/lib/auth/auth-context";
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
  const [data, authContext, evaluationFormConfig] = await Promise.all([
    getPlayerDevelopmentTabData(playerId, discipline),
    getAuthContext(),
    getEvaluationFormConfig(),
  ]);

  return (
    <Suspense fallback={<div>Loading development tab...</div>}>
      <DevelopmentTab
        playerId={playerId}
        createdBy={authContext.userId}
        data={data}
        evaluationDisciplineOptions={evaluationFormConfig.disciplineOptions}
        evaluationBucketOptions={evaluationFormConfig.bucketOptions}
      />
    </Suspense>
  );
}
