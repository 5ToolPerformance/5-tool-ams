"use client";

import { Button, Chip } from "@heroui/react";
import { Paperclip } from "lucide-react";

import { LessonAttachmentData } from "@/db/queries/lessons/lessonQueries.types";
import { useAttachmentViewer } from "@/ui/features/attachments/AttachmentViewerProvider";
import { getAttachmentDisplayName } from "@/ui/features/attachments/types";

import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  attachments: LessonAttachmentData[];
}

export function AttachmentsSection({ attachments }: Props) {
  const { openAttachment } = useAttachmentViewer();

  if (attachments.length === 0) {
    return (
      <LessonViewerSection
        title="Attachments"
        icon={<Paperclip className="h-4 w-4" />}
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No attachments recorded for this player.
        </p>
      </LessonViewerSection>
    );
  }

  return (
    <LessonViewerSection
      title={`Attachments (${attachments.length})`}
      icon={<Paperclip className="h-4 w-4" />}
    >
      <div className="space-y-2">
        {attachments.map((attachment) => {
          const hasFile = Boolean(attachment.file?.storageKey);

          return (
            <div
              key={attachment.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {getAttachmentDisplayName(attachment)}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {attachment.source}
                  </p>
                </div>
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: "bg-zinc-100 dark:bg-zinc-700",
                    content: "text-xs",
                  }}
                >
                  {attachment.type}
                </Chip>
              </div>
              <div className="mt-2 flex items-center justify-end">
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={!hasFile}
                  onPress={() => openAttachment(attachment)}
                >
                  {hasFile ? "View" : "Missing file"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </LessonViewerSection>
  );
}

