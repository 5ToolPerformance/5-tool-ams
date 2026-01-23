import { usePlayerNotes } from "@/hooks";
import { Button, Textarea } from "@heroui/react";
import { useState } from "react";

export function PlayerNoteComposer({ playerId }: { playerId: string }) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { refresh } = usePlayerNotes(playerId);

    const submit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        await fetch("/api/player-notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId, content }),
        });

        setContent("");
        setIsSubmitting(false);
        refresh();
    };

    return (
        <div className="space-y-2">
            <Textarea
                label="Add note"
                placeholder="Parent conversation, follow-ups, context…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <Button
                size="sm"
                color="primary"
                isDisabled={isSubmitting}
                onPress={submit}
            >
                Add Note
            </Button>
        </div>
    );
}
