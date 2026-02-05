import { getPlayerAttachmentsForDocumentsTab } from "@/db/queries/attachments/getPlayerAttachmentsForDocumentsTab";
export type ContextDocumentsAttachment = Awaited<
  ReturnType<typeof getPlayerAttachmentsForDocumentsTab>
>[number];

export async function getContextDocumentsData(playerId: string) {
  const attachments = await getPlayerAttachmentsForDocumentsTab(playerId);

  const contextAttachments = attachments.filter(
    (attachment) => attachment.evidenceCategory === "context"
  );

  return { attachments: contextAttachments };
}
