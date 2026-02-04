import { Suspense } from "react";

import { getContextDocumentsData } from "@/application/players/context-documents/getContextDocumentsData";
import { ContextDocumentsTab } from "@/ui/features/athlete-context-documents/ContextDocumentsTab";

export default async function PlayerContextDocumentsPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const data = await getContextDocumentsData(playerId);

  return (
    <Suspense fallback={<div>Loading context documents...</div>}>
      <ContextDocumentsTab
        attachments={data.attachments}
        lessonOptions={data.lessonOptions}
      />
    </Suspense>
  );
}
