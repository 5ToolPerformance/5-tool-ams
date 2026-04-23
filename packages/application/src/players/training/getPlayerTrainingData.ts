import { getLessonsByPlayerId } from "@ams/db/queries/lessons/lessonQueries";
import { buildTrainingSummary } from "@ams/domain/player/training";

export async function getTrainingTabData(playerId: string) {
  const lessons = await getLessonsByPlayerId(playerId);

  const summary = buildTrainingSummary(lessons);

  return { lessons, summary };
}
