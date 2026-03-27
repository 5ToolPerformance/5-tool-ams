import { Suspense } from "react";

import { getEvaluationFormConfig } from "@/application/evaluations/getEvaluationFormConfig";
import { getPlayerDevelopmentTabData } from "@/application/players/development";
import { getRoutineFormConfig } from "@/application/routines/getRoutineFormConfig";
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
  const authContext = await getAuthContext();
  const [data, evaluationFormConfig] = await Promise.all([
    getPlayerDevelopmentTabData(playerId, discipline, authContext.facilityId),
    getEvaluationFormConfig(),
  ]);
  const routineFormConfig = data.selectedDiscipline
    ? await getRoutineFormConfig({
        playerId,
        facilityId: authContext.facilityId,
        disciplineId: data.selectedDiscipline.id,
        disciplineKey: data.selectedDiscipline.key,
        disciplineLabel: data.selectedDiscipline.label,
        viewer: {
          role: authContext.role,
          userId: authContext.userId,
        },
      })
    : {
        developmentPlanOptions: [],
        disciplineOptions: [],
        mechanicOptions: [],
        drillOptions: [],
      };

  return (
    <Suspense fallback={<div>Loading development tab...</div>}>
      <DevelopmentTab
        playerId={playerId}
        createdBy={authContext.userId}
        data={data}
        evaluationDisciplineOptions={evaluationFormConfig.disciplineOptions}
        evaluationBucketOptions={evaluationFormConfig.bucketOptions}
        routineFormConfig={routineFormConfig}
      />
    </Suspense>
  );
}
