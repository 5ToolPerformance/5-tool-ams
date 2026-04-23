import { getLessonsByPlayerId } from "@/db/queries/lessons/lessonQueries";
import { buildTrainingSummary } from "@/domain/player/training";

export async function getTrainingTabData(playerId: string) {
  const lessons = await getLessonsByPlayerId(playerId);

  const summary = buildTrainingSummary(lessons);

  return { lessons, summary };
}
