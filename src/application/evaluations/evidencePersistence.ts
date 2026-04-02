import { and, eq, inArray } from "drizzle-orm";

import type { DB } from "@/db";
import { getDisciplinesByIds } from "@/db/queries/players/getDisciplinesByIds";
import {
  evaluationBlast,
  evaluationEvidence,
  evaluationHittrax,
  evaluationsStrength,
  performanceSession,
} from "@/db/schema";
import {
  type EvaluationEvidenceSummary,
  type EvaluationEvidenceWriteInput,
  getSupportedEvidenceTypesForDisciplineKey,
  isSupportedEvidenceTypeForDisciplineKey,
} from "@/domain/evaluations/evidence";
import type { EvaluationDocumentV1 } from "@/domain/evaluations/types";
import { DomainError } from "@/lib/errors";

type Transaction = Parameters<Parameters<DB["transaction"]>[0]>[0];

type PersistEvaluationEvidenceParams = {
  tx: Transaction;
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  evidenceForms: EvaluationEvidenceWriteInput[];
};

function normalizeRecordedAt(value: Date | string): Date {
  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new DomainError("Evidence recordedAt is invalid.");
  }

  return parsed;
}

function normalizeMetricValue(value: string | null | undefined) {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function validateEvidenceFormsForDiscipline(
  db: DB,
  disciplineId: string,
  evidenceForms: EvaluationEvidenceWriteInput[]
) {
  const [discipline] = await getDisciplinesByIds(db, [disciplineId]);

  if (!discipline) {
    throw new DomainError("Discipline not found.");
  }

  const supportedTypes = getSupportedEvidenceTypesForDisciplineKey(
    discipline.key
  );
  const submittedTypes = evidenceForms.map((item) => item.type);

  if (new Set(submittedTypes).size !== submittedTypes.length) {
    throw new DomainError("Each evidence type can only be added once.");
  }

  for (const item of evidenceForms) {
    if (!isSupportedEvidenceTypeForDisciplineKey(discipline.key, item.type)) {
      throw new DomainError(
        `${item.type} evidence is not supported for ${discipline.label}.`
      );
    }

    normalizeRecordedAt(item.recordedAt);
  }

  return {
    discipline,
    supportedTypes,
  };
}

export async function replaceEvaluationEvidence({
  tx,
  playerId,
  disciplineId,
  evaluationId,
  evidenceForms,
}: PersistEvaluationEvidenceParams): Promise<EvaluationEvidenceSummary[]> {
  await validateEvidenceFormsForDiscipline(
    tx as unknown as DB,
    disciplineId,
    evidenceForms
  );

  await tx
    .delete(evaluationHittrax)
    .where(eq(evaluationHittrax.evaluationId, evaluationId));
  await tx
    .delete(evaluationBlast)
    .where(eq(evaluationBlast.evaluationId, evaluationId));
  await tx
    .delete(evaluationsStrength)
    .where(eq(evaluationsStrength.evaluationId, evaluationId));
  await tx
    .delete(evaluationEvidence)
    .where(eq(evaluationEvidence.evaluationId, evaluationId));
  await tx
    .delete(performanceSession)
    .where(
      and(
        eq(performanceSession.evaluationId, evaluationId),
        inArray(performanceSession.source, ["hittrax", "blast", "strength"])
      )
    );

  const summaries: EvaluationEvidenceSummary[] = [];

  for (const evidenceForm of evidenceForms) {
    const recordedAt = normalizeRecordedAt(evidenceForm.recordedAt);

    const [session] = await tx
      .insert(performanceSession)
      .values({
        playerId,
        evaluationId,
        source: evidenceForm.type,
        sessionDate: recordedAt.toISOString(),
        status: "completed",
      })
      .returning();

    switch (evidenceForm.type) {
      case "hittrax":
        await tx.insert(evaluationHittrax).values({
          evaluationId,
          performanceSessionId: session.id,
          playerId,
          recordedAt,
          notes: evidenceForm.notes ?? null,
          exitVelocityMax: normalizeMetricValue(evidenceForm.exitVelocityMax),
          exitVelocityAvg: normalizeMetricValue(evidenceForm.exitVelocityAvg),
          hardHitPercent: normalizeMetricValue(evidenceForm.hardHitPercent),
          launchAngleAvg: normalizeMetricValue(evidenceForm.launchAngleAvg),
          lineDriveAvg: normalizeMetricValue(evidenceForm.lineDriveAvg),
        });
        break;
      case "blast":
        await tx.insert(evaluationBlast).values({
          evaluationId,
          performanceSessionId: session.id,
          playerId,
          recordedAt,
          notes: evidenceForm.notes ?? null,
          batSpeedMax: normalizeMetricValue(evidenceForm.batSpeedMax),
          batSpeedAvg: normalizeMetricValue(evidenceForm.batSpeedAvg),
          rotAccMax: normalizeMetricValue(evidenceForm.rotAccMax),
          rotAccAvg: normalizeMetricValue(evidenceForm.rotAccAvg),
          onPlanePercent: normalizeMetricValue(evidenceForm.onPlanePercent),
          attackAngleAvg: normalizeMetricValue(evidenceForm.attackAngleAvg),
          earlyConnAvg: normalizeMetricValue(evidenceForm.earlyConnAvg),
          connAtImpactAvg: normalizeMetricValue(evidenceForm.connAtImpactAvg),
          verticalBatAngleAvg: normalizeMetricValue(
            evidenceForm.verticalBatAngleAvg
          ),
          timeToContactAvg: normalizeMetricValue(evidenceForm.timeToContactAvg),
          handSpeedMax: normalizeMetricValue(evidenceForm.handSpeedMax),
          handSpeedAvg: normalizeMetricValue(evidenceForm.handSpeedAvg),
        });
        break;
      case "strength":
        await tx.insert(evaluationsStrength).values({
          evaluationId,
          performanceSessionId: session.id,
          playerId,
          recordedAt,
          notes: evidenceForm.notes ?? null,
          rotation: normalizeMetricValue(evidenceForm.rotation),
          lowerBodyStrength: normalizeMetricValue(evidenceForm.lowerBodyStrength),
          upperBodyStrength: normalizeMetricValue(evidenceForm.upperBodyStrength),
        });
        break;
    }

    summaries.push({
      source: evidenceForm.type,
      performanceSessionId: session.id,
      recordedAt: recordedAt.toISOString(),
      notes: evidenceForm.notes?.trim() || undefined,
    });
  }

  return summaries;
}

export function mergeDocumentDataWithEvidence(
  documentData: Record<string, unknown> | null | undefined,
  evidence: EvaluationEvidenceSummary[]
): EvaluationDocumentV1 {
  const base =
    documentData && typeof documentData === "object"
      ? ({ ...documentData } as EvaluationDocumentV1)
      : ({ version: 1 } as EvaluationDocumentV1);

  return {
    ...base,
    version: 1,
    evidence: evidence.length ? evidence : undefined,
  };
}
