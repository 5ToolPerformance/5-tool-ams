import type {
  ThrowIntent,
  ThrowType,
  ThrowingArmCheckinInput,
  ThrowingDailySummarySnapshot,
  ThrowingWorkloadSegmentInput,
  WorkloadQuality,
} from "./types";

function getThrowTypeWeight(throwType: ThrowType) {
  switch (throwType) {
    case "game":
      return 1.5;
    case "bullpen":
      return 1.35;
    case "pulldown":
      return 1.25;
    case "flat_ground":
      return 1.1;
    case "long_toss":
      return 1;
    case "catch_play":
      return 0.8;
    case "recovery_catch":
      return 0.6;
    default:
      return 0.9;
  }
}

function getIntentWeight(intent: ThrowIntent | null) {
  switch (intent) {
    case "max":
      return 1.35;
    case "high":
      return 1.2;
    case "moderate":
      return 1;
    case "low":
      return 0.8;
    default:
      return 1;
  }
}

function getVelocityWeight(segment: ThrowingWorkloadSegmentInput) {
  const top = segment.velocityMax ?? segment.velocityAvg;

  if (top === null) {
    return null;
  }

  if (top >= 90) {
    return 1.4;
  }

  if (top >= 82) {
    return 1.25;
  }

  if (top >= 75) {
    return 1.12;
  }

  return 1;
}

export function getTotalThrowCount(segments: ThrowingWorkloadSegmentInput[]) {
  return segments.reduce((total, segment) => total + segment.throwCount, 0);
}

export function getTotalPitchCount(segments: ThrowingWorkloadSegmentInput[]) {
  return segments.reduce((total, segment) => total + (segment.pitchCount ?? 0), 0);
}

export function hasHighIntentExposure(segments: ThrowingWorkloadSegmentInput[]) {
  return segments.some(
    (segment) => segment.intentLevel === "high" || segment.intentLevel === "max"
  );
}

export function hasGameExposure(segments: ThrowingWorkloadSegmentInput[]) {
  return segments.some((segment) => segment.throwType === "game");
}

export function hasBullpenExposure(segments: ThrowingWorkloadSegmentInput[]) {
  return segments.some((segment) => segment.throwType === "bullpen");
}

export function getWorkloadQuality(
  segments: ThrowingWorkloadSegmentInput[]
): WorkloadQuality {
  const hasVelocity = segments.some(
    (segment) => segment.velocityAvg !== null || segment.velocityMax !== null
  );
  const hasIntent = segments.some((segment) => segment.intentLevel !== null);

  if (hasVelocity && hasIntent) {
    return "mixed";
  }

  if (hasVelocity) {
    return "velocity_based";
  }

  if (hasIntent) {
    return "intent_based";
  }

  return "type_only";
}

export function computeThrowingWorkloadUnits(
  segments: ThrowingWorkloadSegmentInput[]
) {
  const total = segments.reduce((sum, segment) => {
    const baseWeight = getThrowTypeWeight(segment.throwType);
    const velocityWeight = getVelocityWeight(segment);
    const intentWeight = velocityWeight === null ? getIntentWeight(segment.intentLevel) : 1;
    const multiplier = velocityWeight ?? intentWeight;
    return sum + segment.throwCount * baseWeight * multiplier;
  }, 0);

  return Number(total.toFixed(2));
}

export function getWorkloadConfidence(segments: ThrowingWorkloadSegmentInput[]) {
  const quality = getWorkloadQuality(segments);

  switch (quality) {
    case "mixed":
      return 95;
    case "velocity_based":
      return 90;
    case "intent_based":
      return 78;
    default:
      return 60;
  }
}

export function summarizeLatestArmCheckin(
  armCheckins: Array<ThrowingArmCheckinInput | null>
) {
  const filtered = armCheckins.filter(
    (checkin): checkin is ThrowingArmCheckinInput => checkin !== null
  );

  if (filtered.length === 0) {
    return {
      sorenessScore: null,
      fatigueScore: null,
    };
  }

  const latest = filtered[filtered.length - 1];

  const fatigueValues = [latest.armFatigue, latest.bodyFatigue].filter(
    (value): value is number => value !== null
  );

  return {
    sorenessScore: latest.armSoreness,
    fatigueScore:
      fatigueValues.length > 0
        ? Math.round(
            fatigueValues.reduce((total, value) => total + value, 0) / fatigueValues.length
          )
        : null,
  };
}

export function buildThrowingDailySummarySnapshot(params: {
  playerId: string;
  summaryDate: string;
  entryCount: number;
  segments: ThrowingWorkloadSegmentInput[];
  armCheckins: Array<ThrowingArmCheckinInput | null>;
}): ThrowingDailySummarySnapshot {
  const { playerId, summaryDate, entryCount, segments, armCheckins } = params;
  const armSummary = summarizeLatestArmCheckin(armCheckins);

  return {
    playerId,
    summaryDate,
    totalThrowCount: getTotalThrowCount(segments),
    totalPitchCount: getTotalPitchCount(segments),
    workloadUnits: computeThrowingWorkloadUnits(segments),
    workloadQuality: getWorkloadQuality(segments),
    workloadConfidence: getWorkloadConfidence(segments),
    sorenessScore: armSummary.sorenessScore,
    fatigueScore: armSummary.fatigueScore,
    entryCount,
    hasGameExposure: hasGameExposure(segments),
    hasBullpen: hasBullpenExposure(segments),
    hasHighIntentExposure: hasHighIntentExposure(segments),
  };
}
