import { Card, CardBody } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";

import { PlayerNoteCardData } from "@/domain/player/notes/types";

interface PlayerNoteCardProps {
  note: PlayerNoteCardData;
}

export function PlayerNoteCard({ note }: PlayerNoteCardProps) {
  return (
    <Card shadow="sm" className="border border-divider">
      <CardBody className="space-y-2 p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {note.author.name}
          </span>
          <span>
            {formatDistanceToNow(new Date(note.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <p className="whitespace-pre-line text-sm leading-relaxed">
          {note.content}
        </p>
      </CardBody>
    </Card>
  );
}
