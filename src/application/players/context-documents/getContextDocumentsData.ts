import { getPlayerAttachmentsForDocumentsTab } from "@/db/queries/attachments/getPlayerAttachmentsForDocumentsTab";
import { getAllLessonsForPlayer } from "@/db/queries/lessons/lessonQueries";

export type ContextDocumentsLessonOption = {
  lessonPlayerId: string;
  lessonId: string;
  lessonDate: string | null;
  lessonType: string | null;
  coachName: string | null;
};

export type ContextDocumentsAttachment = Awaited<
  ReturnType<typeof getPlayerAttachmentsForDocumentsTab>
>[number];

export async function getContextDocumentsData(playerId: string) {
  const [attachments, lessons] = await Promise.all([
    getPlayerAttachmentsForDocumentsTab(playerId),
    getAllLessonsForPlayer(playerId),
  ]);

  const lessonOptions: ContextDocumentsLessonOption[] = lessons.flatMap(
    (lesson) => {
      const playerEntry = lesson.players.find((p) => p.id === playerId);
      if (!playerEntry?.lessonPlayerId) return [];
      return [
        {
          lessonPlayerId: playerEntry.lessonPlayerId,
          lessonId: lesson.id,
          lessonDate: lesson.lessonDate,
          lessonType: lesson.lessonType,
          coachName: lesson.coach.name,
        },
      ];
    }
  );

  const contextAttachments = attachments.filter(
    (attachment) => attachment.evidenceCategory === "context"
  );

  return { attachments: contextAttachments, lessonOptions };
}
