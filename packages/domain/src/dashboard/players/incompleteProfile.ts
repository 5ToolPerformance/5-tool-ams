import {
  IncompletePlayerProfile,
  IncompleteProfileReason,
} from "@/domain/dashboard/types";
import { calculateAge } from "../../utils/dates";

const VALID_HANDEDNESS = new Set(["right", "left", "switch"]);

export interface IncompleteProfileInput {
  playerId: string;
  firstName: string | null;
  lastName: string | null;
  primaryCoachId: string | null;
  throws: string | null;
  hits: string | null;
  dateOfBirth: string | null;
}

function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function evaluateIncompleteProfile(
  input: IncompleteProfileInput
): IncompleteProfileReason[] {
  const reasons: IncompleteProfileReason[] = [];

  if (isBlank(input.firstName)) reasons.push("missing_first_name");
  if (isBlank(input.lastName)) reasons.push("missing_last_name");
  if (!input.primaryCoachId) reasons.push("missing_primary_coach");
  if (!input.throws || !VALID_HANDEDNESS.has(input.throws)) {
    reasons.push("invalid_throws");
  }
  if (!input.hits || !VALID_HANDEDNESS.has(input.hits)) {
    reasons.push("invalid_hits");
  }

  if (input.dateOfBirth) {
    const dob = new Date(input.dateOfBirth);
    if (!Number.isNaN(dob.getTime())) {
      if (calculateAge(input.dateOfBirth) < 5) {
        reasons.push("age_under_5");
      }
    }
  }

  return reasons;
}

export function buildIncompletePlayerProfiles(
  players: IncompleteProfileInput[]
): IncompletePlayerProfile[] {
  return players
    .map((player) => {
      const reasons = evaluateIncompleteProfile(player);

      return {
        playerId: player.playerId,
        firstName: player.firstName?.trim() ?? "",
        lastName: player.lastName?.trim() ?? "",
        reasons,
      };
    })
    .filter((player) => player.reasons.length > 0)
    .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
}

