import { Chip } from "@heroui/react";
import { Paperclip, Video } from "lucide-react";

interface LessonEvidenceChipsProps {
  videoCount: number;
  attachmentCount: number;
}

export function LessonEvidenceChips({
  videoCount,
  attachmentCount,
}: LessonEvidenceChipsProps) {
  if (videoCount === 0 && attachmentCount === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {videoCount > 0 && (
        <Chip
          size="sm"
          variant="flat"
          startContent={<Video className="h-3.5 w-3.5" />}
          classNames={{
            base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
            content: "text-xs",
          }}
        >
          Video x{videoCount}
        </Chip>
      )}
      {attachmentCount > 0 && (
        <Chip
          size="sm"
          variant="flat"
          startContent={<Paperclip className="h-3.5 w-3.5" />}
          classNames={{
            base: "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
            content: "text-xs",
          }}
        >
          Attachment x{attachmentCount}
        </Chip>
      )}
    </div>
  );
}

