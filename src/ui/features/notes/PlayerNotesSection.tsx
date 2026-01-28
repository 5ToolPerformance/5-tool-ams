import { ScrollShadow } from "@heroui/react";

import { PlayerNoteCardData } from "@/domain/player/notes/types";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { PlayerNoteCard } from "./PlayerNoteCard";

interface PlayerNotesSectionProps {
  notes: PlayerNoteCardData[];
}

export function PlayerNotesSection({ notes }: PlayerNotesSectionProps) {
  return (
    <SectionShell
      title="Player Notes"
      description="Coach and admin observations"
    >
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No notes have been added yet.
        </p>
      ) : (
        <ScrollShadow hideScrollBar className="max-h-64 space-y-3 pr-2">
          {notes.map((note) => (
            <PlayerNoteCard key={note.id} note={note} />
          ))}
        </ScrollShadow>
      )}
    </SectionShell>
  );
}
