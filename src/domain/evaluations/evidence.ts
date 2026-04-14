export type EvaluationEvidenceType = "hittrax" | "blast" | "strength";

export type EvaluationEvidenceSummary = {
  source: EvaluationEvidenceType;
  performanceSessionId: string;
  recordedAt?: string;
  notes?: string;
};

type EvaluationEvidenceBaseInput = {
  type: EvaluationEvidenceType;
  recordedAt: Date | string;
  notes?: string | null;
  performanceSessionId?: string;
  evidenceId?: string;
};

export type EvaluationHittraxEvidenceInput = EvaluationEvidenceBaseInput & {
  type: "hittrax";
  exitVelocityMax?: string | null;
  exitVelocityAvg?: string | null;
  hardHitPercent?: string | null;
  launchAngleAvg?: string | null;
  lineDriveAvg?: string | null;
};

export type EvaluationBlastEvidenceInput = EvaluationEvidenceBaseInput & {
  type: "blast";
  batSpeedMax?: string | null;
  batSpeedAvg?: string | null;
  rotAccMax?: string | null;
  rotAccAvg?: string | null;
  onPlanePercent?: string | null;
  attackAngleAvg?: string | null;
  earlyConnAvg?: string | null;
  connAtImpactAvg?: string | null;
  verticalBatAngleAvg?: string | null;
  timeToContactAvg?: string | null;
  handSpeedMax?: string | null;
  handSpeedAvg?: string | null;
  powerAvg?: string | null;
};

export type EvaluationStrengthEvidenceInput = EvaluationEvidenceBaseInput & {
  type: "strength";
  powerRating?: string | null;
  rotation?: string | null;
  lowerBodyStrength?: string | null;
  upperBodyStrength?: string | null;
  plyoPushup?: string | null;
  seatedShoulderErL?: string | null;
  seatedShoulderErR?: string | null;
  seatedShoulderIrL?: string | null;
  seatedShoulderIrR?: string | null;
  cmj?: string | null;
  cmjPropulsiveImpulse?: string | null;
  cmjPeakPower?: string | null;
  pogoJump?: string | null;
  dropJump?: string | null;
  midThighPull?: string | null;
  midThighPullTtpf?: string | null;
  netForce100ms?: string | null;
  shotPut?: string | null;
  scoopToss?: string | null;
};

export type EvaluationEvidenceWriteInput =
  | EvaluationHittraxEvidenceInput
  | EvaluationBlastEvidenceInput
  | EvaluationStrengthEvidenceInput;

export const EVALUATION_EVIDENCE_TYPES_BY_DISCIPLINE = {
  hitting: ["hittrax", "blast"],
  strength: ["strength"],
} as const;

export function getSupportedEvidenceTypesForDisciplineKey(
  disciplineKey: string | null | undefined
): EvaluationEvidenceType[] {
  if (!disciplineKey) {
    return [];
  }

  const supported =
    EVALUATION_EVIDENCE_TYPES_BY_DISCIPLINE[
      disciplineKey as keyof typeof EVALUATION_EVIDENCE_TYPES_BY_DISCIPLINE
    ];

  return supported ? [...supported] : [];
}

export function isSupportedEvidenceTypeForDisciplineKey(
  disciplineKey: string | null | undefined,
  evidenceType: EvaluationEvidenceType
) {
  return getSupportedEvidenceTypesForDisciplineKey(disciplineKey).includes(
    evidenceType
  );
}
