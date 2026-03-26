import db from "@/db";
import { getDevelopmentPlanById } from "@/db/queries/development-plans/getDevelopmentPlanById";
import { getEvaluationById } from "@/db/queries/evaluations/getEvaluationById";
import type { EvaluationEvidenceWriteInput } from "@/domain/evaluations/evidence";
import type { AttachmentViewerAttachment } from "@/ui/features/attachments/types";

import {
  parseDevelopmentPlanReportDetails,
  parseEvaluationReportDetails,
} from "./documentDataParsers";

type EvaluationRow = Awaited<ReturnType<typeof getEvaluationById>>;
type DevelopmentPlanRow = Awaited<ReturnType<typeof getDevelopmentPlanById>>;

function mapAttachments(
  attachments: EvaluationRow["mediaAttachments"]
): AttachmentViewerAttachment[] {
  return attachments.map((attachment) => ({
    ...attachment,
    createdAt:
      typeof attachment.createdAt === "string"
        ? attachment.createdAt
        : new Date(attachment.createdAt).toISOString(),
  }));
}

function buildEvaluationEvidenceSummary(
  evaluation: EvaluationRow
): EvaluationEvidenceWriteInput[] {
  return Array.isArray(evaluation.evidenceForms) ? evaluation.evidenceForms : [];
}

export type EvaluationDetailData = {
  id: string;
  playerId: string;
  disciplineId: string;
  evaluationDate: Date;
  evaluationType: string;
  phase: string;
  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;
  details: ReturnType<typeof parseEvaluationReportDetails>;
  evidenceForms: EvaluationEvidenceWriteInput[];
  attachments: AttachmentViewerAttachment[];
};

export type DevelopmentPlanDetailData = {
  id: string;
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  status: string;
  startDate: Date | null;
  targetEndDate: Date | null;
  details: ReturnType<typeof parseDevelopmentPlanReportDetails>;
  linkedEvaluation: EvaluationDetailData | null;
};

export async function getEvaluationDetail(
  evaluationId: string
): Promise<EvaluationDetailData> {
  const evaluation = await getEvaluationById(db, evaluationId);

  return {
    id: evaluation.id,
    playerId: evaluation.playerId,
    disciplineId: evaluation.disciplineId,
    evaluationDate: evaluation.evaluationDate,
    evaluationType: evaluation.evaluationType,
    phase: evaluation.phase,
    snapshotSummary: evaluation.snapshotSummary,
    strengthProfileSummary: evaluation.strengthProfileSummary,
    keyConstraintsSummary: evaluation.keyConstraintsSummary,
    details: parseEvaluationReportDetails(evaluation.documentData),
    evidenceForms: buildEvaluationEvidenceSummary(evaluation),
    attachments: mapAttachments(evaluation.mediaAttachments),
  };
}

export async function getDevelopmentPlanDetail(
  developmentPlanId: string
): Promise<DevelopmentPlanDetailData> {
  const plan = await getDevelopmentPlanById(db, developmentPlanId);
  const linkedEvaluation = await getEvaluationById(db, plan.evaluationId).catch(
    () => null
  );

  return {
    id: plan.id,
    playerId: plan.playerId,
    disciplineId: plan.disciplineId,
    evaluationId: plan.evaluationId,
    status: plan.status,
    startDate: plan.startDate,
    targetEndDate: plan.targetEndDate,
    details: parseDevelopmentPlanReportDetails(plan.documentData),
    linkedEvaluation: linkedEvaluation
      ? {
          id: linkedEvaluation.id,
          playerId: linkedEvaluation.playerId,
          disciplineId: linkedEvaluation.disciplineId,
          evaluationDate: linkedEvaluation.evaluationDate,
          evaluationType: linkedEvaluation.evaluationType,
          phase: linkedEvaluation.phase,
          snapshotSummary: linkedEvaluation.snapshotSummary,
          strengthProfileSummary: linkedEvaluation.strengthProfileSummary,
          keyConstraintsSummary: linkedEvaluation.keyConstraintsSummary,
          details: parseEvaluationReportDetails(linkedEvaluation.documentData),
          evidenceForms: buildEvaluationEvidenceSummary(linkedEvaluation),
          attachments: mapAttachments(linkedEvaluation.mediaAttachments),
        }
      : null,
  };
}
