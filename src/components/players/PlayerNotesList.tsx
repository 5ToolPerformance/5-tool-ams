import { usePlayerNotes } from "@/hooks";
import { Card, CardBody } from "@heroui/react";

export function PlayerNotesList({ playerId }: { playerId: string }) {
    const { notes, isLoading } = usePlayerNotes(playerId);

    if (isLoading) {
        return <p className="text-default-500">Loading notes…</p>;
    }

    if (!notes.length) {
        return <p className="text-default-500">No notes yet.</p>;
    }

    return (
        <div className="space-y-3">
            {notes.map((note) => (
                <Card key={note.id} className="bg-default-50">
                    <CardBody className="p-3 space-y-1">
                        <div className="flex justify-between text-xs text-default-500">
                            <span>
                                {note.author?.firstName} {note.author?.lastName}
                            </span>
                            <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="text-sm whitespace-pre-wrap">
                            {note.content}
                        </p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
