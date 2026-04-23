import db from "@/db";
import { getPlayerInjuries } from "@/db/queries/injuries/getPlayerInjuries";
import { getLatestPlayerArmScore, getPlayerSummary, getUnmatchedExams, getUnmatchedPlayers, linkArmcarePlayer } from "@/db/queries/external-systems/armcare/armcareExamsRepository";

export type HealthInjury = Awaited<ReturnType<typeof getPlayerInjuries>>[number];

export interface HealthArmCareSnapshot {
  score: number;
  date: string;
}

export interface HealthTabData {
  injuries: HealthInjury[];
  armCare: HealthArmCareSnapshot | null;
}

export async function getHealthTabData(playerId: string): Promise<HealthTabData> {
  const [injuries, latestArmScore] = await Promise.all([
    getPlayerInjuries(db, playerId),
    getLatestPlayerArmScore(playerId),
  ]);

  const parsedScore = latestArmScore?.armScore
    ? Number(latestArmScore.armScore)
    : NaN;

  return {
    injuries,
    armCare:
      Number.isFinite(parsedScore) && latestArmScore?.examDate
        ? {
            score: parsedScore,
            date: latestArmScore.examDate,
          }
        : null,
  };
}
