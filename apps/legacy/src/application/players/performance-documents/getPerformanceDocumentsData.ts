import { getPlayerAttachmentsForDocumentsTab } from "@/db/queries/attachments/getPlayerAttachmentsForDocumentsTab";

export type PerformanceDocumentsAttachment = Awaited<
  ReturnType<typeof getPlayerAttachmentsForDocumentsTab>
>[number];

export async function getPerformanceDocumentsData(playerId: string) {
  const attachments = await getPlayerAttachmentsForDocumentsTab(playerId);
  return attachments.filter(
    (attachment) =>
      attachment.evidenceCategory === "performance" ||
      attachment.evidenceCategory === "media"
  );
}
