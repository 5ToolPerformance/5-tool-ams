import { eq } from "drizzle-orm";

import { DB } from "@/db";
import {
  evaluationBlast,
  evaluationHittrax,
  evaluationsStrength,
} from "@/db/schema";
import type { EvaluationEvidenceWriteInput } from "@/domain/evaluations/evidence";

export async function getEvaluationEvidenceByEvaluationId(
  db: DB,
  evaluationId: string
): Promise<EvaluationEvidenceWriteInput[]> {
  const [hittrax, blast, strength] = await Promise.all([
    db.query.evaluationHittrax.findFirst({
      where: eq(evaluationHittrax.evaluationId, evaluationId),
    }),
    db.query.evaluationBlast.findFirst({
      where: eq(evaluationBlast.evaluationId, evaluationId),
    }),
    db.query.evaluationsStrength.findFirst({
      where: eq(evaluationsStrength.evaluationId, evaluationId),
    }),
  ]);

  const evidence: EvaluationEvidenceWriteInput[] = [];

  if (hittrax) {
    evidence.push({
      type: "hittrax",
      evidenceId: hittrax.id,
      performanceSessionId: hittrax.performanceSessionId,
      recordedAt: hittrax.recordedAt,
      notes: hittrax.notes,
      exitVelocityMax: hittrax.exitVelocityMax,
      exitVelocityAvg: hittrax.exitVelocityAvg,
      hardHitPercent: hittrax.hardHitPercent,
      launchAngleAvg: hittrax.launchAngleAvg,
      lineDriveAvg: hittrax.lineDriveAvg,
    });
  }

  if (blast) {
    evidence.push({
      type: "blast",
      evidenceId: blast.id,
      performanceSessionId: blast.performanceSessionId,
      recordedAt: blast.recordedAt,
      notes: blast.notes,
      batSpeedMax: blast.batSpeedMax,
      batSpeedAvg: blast.batSpeedAvg,
      rotAccMax: blast.rotAccMax,
      rotAccAvg: blast.rotAccAvg,
      onPlanePercent: blast.onPlanePercent,
      attackAngleAvg: blast.attackAngleAvg,
      earlyConnAvg: blast.earlyConnAvg,
      connAtImpactAvg: blast.connAtImpactAvg,
      verticalBatAngleAvg: blast.verticalBatAngleAvg,
      timeToContactAvg: blast.timeToContactAvg,
      handSpeedMax: blast.handSpeedMax,
      handSpeedAvg: blast.handSpeedAvg,
    });
  }

  if (strength) {
    evidence.push({
      type: "strength",
      evidenceId: strength.id,
      performanceSessionId: strength.performanceSessionId,
      recordedAt: strength.recordedAt,
      notes: strength.notes,
      powerRating: strength.powerRating,
    });
  }

  return evidence;
}
