"use server";

import { coachRepository } from "../repository/coaches";

export async function getAllCoachesSubmissionMetrics() {
  return coachRepository.getAllCoachesSubmissionMetrics();
}
