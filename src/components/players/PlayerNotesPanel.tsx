import { Card, CardBody } from "@heroui/react";
import { PlayerNoteComposer } from "./PlayerNoteComposer";
import { PlayerNotesList } from "./PlayerNotesList";

export function PlayerNotesPanel({ playerId }: { playerId: string }) {
    return (
        <Card>
            <CardBody className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Notes</h2>
                <PlayerNotesList playerId={playerId} />
                <PlayerNoteComposer playerId={playerId} />
            </CardBody>
        </Card>
    );
}
