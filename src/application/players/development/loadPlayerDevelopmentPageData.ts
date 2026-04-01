import type { AuthContext } from "@/lib/auth/auth-context";
import { getEvaluationFormConfig } from "@/application/evaluations/getEvaluationFormConfig";
import { getRoutineFormConfig, type RoutineFormConfig } from "@/application/routines/getRoutineFormConfig";

import {
  getPlayerDevelopmentTabData,
  type PlayerDevelopmentTabData,
} from "./getPlayerDevelopmentTabData";

export type PlayerDevelopmentPageData = {
  data: PlayerDevelopmentTabData;
  routineFormConfig: RoutineFormConfig;
};

export async function loadPlayerDevelopmentPageData(params: {
  playerId: string;
  discipline?: string;
  authContext: AuthContext;
}): Promise<PlayerDevelopmentPageData> {
  const data = await getPlayerDevelopmentTabData(
    params.playerId,
    params.discipline,
    params.authContext.facilityId
  );

  const routineFormConfig = data.selectedDiscipline
    ? await getRoutineFormConfig({
        playerId: params.playerId,
        facilityId: params.authContext.facilityId,
        disciplineId: data.selectedDiscipline.id,
        disciplineKey: data.selectedDiscipline.key,
        disciplineLabel: data.selectedDiscipline.label,
        viewer: {
          role: params.authContext.role,
          userId: params.authContext.userId,
        },
      })
    : {
        developmentPlanOptions: [],
        disciplineOptions: [],
        mechanicOptions: [],
        drillOptions: [],
      };

  return {
    data,
    routineFormConfig,
  };
}

export type PlayerDevelopmentPageBootstrapData = PlayerDevelopmentPageData & {
  evaluationDisciplineOptions: Awaited<
    ReturnType<typeof getEvaluationFormConfig>
  >["disciplineOptions"];
  evaluationBucketOptions: Awaited<
    ReturnType<typeof getEvaluationFormConfig>
  >["bucketOptions"];
};
