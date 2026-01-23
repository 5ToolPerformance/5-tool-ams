import { Card, CardBody } from "@heroui/react";

interface PlayerNotesPanelProps {
    playerId: string;
}

export function PlayerNotesPanel({ playerId }: PlayerNotesPanelProps) {
    return (
        <Card>
            <CardBody className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Notes</h2>
                </div>

                {/* Notes list will go here */}
                {/* Composer will go here */}
            </CardBody>
        </Card>
    );
}
