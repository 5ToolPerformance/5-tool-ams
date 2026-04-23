"use client";

import { Button } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { X } from "lucide-react";

import { PlayerDirectoryItem } from "@/domain/player/directory";

interface RecentPlayersChipsProps {
  players: PlayerDirectoryItem[];
  onOpenPlayer: (playerId: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onClearAll: () => void;
}

export function RecentPlayersChips({
  players,
  onOpenPlayer,
  onRemovePlayer,
  onClearAll,
}: RecentPlayersChipsProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <Card shadow="sm" className="mb-6">
      <CardBody className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Recent Players
          </p>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Clear recent players"
            onPress={onClearAll}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="inline-flex items-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            >
              <Button
                size="sm"
                variant="light"
                className="rounded-none text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                onPress={() => onOpenPlayer(player.id)}
              >
                {player.firstName} {player.lastName}
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="rounded-none border-l border-slate-300 text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label={`Remove ${player.firstName} ${player.lastName} from recent`}
                onPress={() => onRemovePlayer(player.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
