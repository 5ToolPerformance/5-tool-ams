"use client";

import { FileText } from "lucide-react";

import { LessonViewerSection } from "./LessonViewerSection";

interface Props {
  notes: string | null;
}

export function NotesSection({ notes }: Props) {
  return (
    <LessonViewerSection title="Notes" icon={<FileText className="h-4 w-4" />}>
      {notes ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {notes}
          </p>
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No notes recorded for this lesson.
        </p>
      )}
    </LessonViewerSection>
  );
}
