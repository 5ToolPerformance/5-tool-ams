import type { EvaluationEvidenceType } from "@ams/domain/evaluations/evidence";
import type { AttachmentViewerAttachment } from "@/ui/features/attachments/types";

import type {
  EvaluationBucketStatus,
  EvaluationFormEvidence,
  EvaluationMediaAttachment,
  EvaluationFormRecord,
  EvaluationFormValues,
} from "./evaluationForm.types";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateTimeInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  const hours = `${parsed.getHours()}`.padStart(2, "0");
  const minutes = `${parsed.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function createEmptyEvaluationFormValues(): EvaluationFormValues {
  return {
    disciplineId: "",
    evaluationDate: toDateInputValue(new Date()),
    evaluationType: "general",
    phase: "general",
    injuryConsiderations: "",

    snapshotSummary: "",
    strengthProfileSummary: "",
    keyConstraintsSummary: "",

    snapshotNotes: "",

    strengths: [],
    strengthProfileNotes: "",

    constraints: [],
    constraintsNotes: "",

    focusAreas: [],
    buckets: [],
    evidence: [],
    mediaAttachments: [],
  };
}

function createMediaAttachmentFromRecord(
  attachment: AttachmentViewerAttachment
): EvaluationMediaAttachment | null {
  if (attachment.type !== "file_image" && attachment.type !== "file_video") {
    return null;
  }

  return {
    id: createId("media"),
    status: "uploaded",
    type: attachment.type,
    fileName:
      attachment.file?.originalFileName ?? attachment.source ?? "Attachment",
    mimeType: attachment.file?.mimeType ?? "application/octet-stream",
    createdAt: attachment.createdAt,
    attachmentId: attachment.id,
  };
}

export function createEvaluationFormValuesFromRecord(
  evaluation: EvaluationFormRecord
): EvaluationFormValues {
  const doc = evaluation.documentData;

  return {
    disciplineId: evaluation.disciplineId,
    evaluationDate: toDateInputValue(evaluation.evaluationDate),
    evaluationType: evaluation.evaluationType,
    phase: evaluation.phase,
    injuryConsiderations: evaluation.injuryConsiderations ?? "",

    snapshotSummary: evaluation.snapshotSummary ?? "",
    strengthProfileSummary: evaluation.strengthProfileSummary ?? "",
    keyConstraintsSummary: evaluation.keyConstraintsSummary ?? "",

    snapshotNotes: doc?.snapshot?.notes ?? "",

    strengths: doc?.strengthProfile?.strengths ?? [],
    strengthProfileNotes: doc?.strengthProfile?.notes ?? "",

    constraints: doc?.constraints?.constraints ?? [],
    constraintsNotes: doc?.constraints?.notes ?? "",

    focusAreas: (doc?.focusAreas ?? []).map((item) => ({
      id: createId("focus"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),

    buckets: (doc?.buckets ?? []).map((item) => ({
      id: createId("bucket"),
      bucketId: item.bucketId ?? "",
      status: item.status,
      notes: item.notes ?? "",
    })),

    evidence: (evaluation.evidenceForms ?? []).map((item) => ({
      ...item,
      id: createId("evidence"),
      recordedAt: toDateTimeInputValue(item.recordedAt),
      notes: item.notes ?? "",
    })),
    mediaAttachments: (evaluation.mediaAttachments ?? [])
      .map(createMediaAttachmentFromRecord)
      .filter((item): item is EvaluationMediaAttachment => Boolean(item)),
  };
}

export function cloneEvaluationFormValues(
  values: EvaluationFormValues
): EvaluationFormValues {
  return {
    ...values,
    strengths: [...values.strengths],
    constraints: [...values.constraints],
    focusAreas: values.focusAreas.map((item) => ({ ...item })),
    buckets: values.buckets.map((item) => ({ ...item })),
    evidence: values.evidence.map((item) => ({ ...item })),
    mediaAttachments: values.mediaAttachments.map((item) => ({ ...item })),
  };
}

export function createEmptyFocusArea() {
  return {
    id: createId("focus"),
    title: "",
    description: "",
  };
}

export function createEmptyBucket(
  bucketId = "",
  status: EvaluationBucketStatus | "" = ""
) {
  return {
    id: createId("bucket"),
    bucketId,
    status,
    notes: "",
  };
}

export function createEmptyEvidence() {
  return createEmptyEvidenceOfType("hittrax");
}

export function createEmptyEvidenceOfType(
  type: EvaluationEvidenceType
): EvaluationFormEvidence {
  const base = {
    id: createId("evidence"),
    recordedAt: "",
    notes: "",
  };

  switch (type) {
    case "hittrax":
      return {
        ...base,
        type,
        exitVelocityMax: "",
        exitVelocityAvg: "",
        hardHitPercent: "",
        launchAngleAvg: "",
        lineDriveAvg: "",
      };
    case "blast":
      return {
        ...base,
        type,
        batSpeedMax: "",
        batSpeedAvg: "",
        rotAccMax: "",
        rotAccAvg: "",
        onPlanePercent: "",
        attackAngleAvg: "",
        earlyConnAvg: "",
        connAtImpactAvg: "",
        verticalBatAngleAvg: "",
        timeToContactAvg: "",
        handSpeedMax: "",
        handSpeedAvg: "",
        powerAvg: "",
      };
    case "strength":
      return {
        ...base,
        type,
        plyoPushup: "",
        seatedShoulderErL: "",
        seatedShoulderErR: "",
        seatedShoulderIrL: "",
        seatedShoulderIrR: "",
        cmj: "",
        cmjPropulsiveImpulse: "",
        cmjPeakPower: "",
        pogoJump: "",
        dropJump: "",
        midThighPull: "",
        midThighPullTtpf: "",
        netForce100ms: "",
        shotPut: "",
        scoopToss: "",
      };
  }
}
