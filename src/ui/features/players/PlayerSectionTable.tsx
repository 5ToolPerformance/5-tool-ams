"use client";

import {
  Chip,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { PlayerDirectoryItem } from "@/domain/player/directory";

interface PlayerSectionTableProps {
  title: string;
  players: PlayerDirectoryItem[];
  emptyMessage: string;
  onOpenPlayer: (playerId: string) => void;
  className?: string;
  scrollHeightClassName: string;
}

function formatPositions(player: PlayerDirectoryItem) {
  const parts: string[] = [];
  if (player.primaryPosition) {
    parts.push(player.primaryPosition.code);
  }
  if (player.secondaryPositions.length > 0) {
    parts.push(
      player.secondaryPositions.map((position) => position.code).join(", ")
    );
  }
  return parts.join(" | ");
}

function injuryStatusChip(player: PlayerDirectoryItem) {
  if (player.injuryStatus === "limited") {
    return (
      <Chip size="sm" variant="flat" color="warning">
        Limited
      </Chip>
    );
  }
  if (player.injuryStatus === "injured") {
    return (
      <Chip size="sm" variant="flat" color="danger">
        Injured
      </Chip>
    );
  }
  return (
    <Chip size="sm" variant="flat" color="success">
      None
    </Chip>
  );
}

export function PlayerSectionTable({
  title,
  players,
  emptyMessage,
  onOpenPlayer,
  className,
  scrollHeightClassName,
}: PlayerSectionTableProps) {
  return (
    <section
      className={`flex flex-col space-y-3 bg-transparent ${className ?? ""}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {players.length} players
        </p>
      </div>

      <ScrollShadow
        className={`${scrollHeightClassName} rounded-md bg-transparent`}
      >
        <Table aria-label={`${title} players table`}>
          <TableHeader>
            <TableColumn>PLAYER</TableColumn>
            <TableColumn>POSITIONS</TableColumn>
            <TableColumn>INJURY STATUS</TableColumn>
            <TableColumn>H/T</TableColumn>
            <TableColumn>AGE</TableColumn>
            <TableColumn>PROSPECT</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </div>
            }
          >
            {players.map((player) => (
              <TableRow
                key={player.id}
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => onOpenPlayer(player.id)}
              >
                <TableCell className="font-medium">
                  {player.firstName} {player.lastName}
                </TableCell>
                <TableCell>{formatPositions(player) || "-"}</TableCell>
                <TableCell>{injuryStatusChip(player)}</TableCell>
                <TableCell>
                  {(player.hits?.slice(0, 1) ?? "?").toUpperCase()}/
                  {(player.throws?.slice(0, 1) ?? "?").toUpperCase()}
                </TableCell>
                <TableCell>{player.age ?? "-"}</TableCell>
                <TableCell>
                  {player.prospect ? (
                    <Chip size="sm" variant="flat" color="default">
                      Prospect
                    </Chip>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollShadow>
    </section>
  );
}
