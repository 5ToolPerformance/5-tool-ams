"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectItem } from "@heroui/react";

import type { ClientAccessiblePlayerSummary } from "@ams/domain/client-portal/types";

export function PortalPlayerSwitcher({
  players,
  selectedPlayerId,
}: {
  players: ClientAccessiblePlayerSummary[];
  selectedPlayerId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (players.length <= 1) {
    return null;
  }

  return (
    <Select
      label="Viewing"
      selectedKeys={selectedPlayerId ? [selectedPlayerId] : []}
      onSelectionChange={(keys) => {
        const nextPlayerId = Array.from(keys)[0] as string | undefined;
        if (!nextPlayerId) {
          return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set("playerId", nextPlayerId);
        router.push(`?${params.toString()}`);
      }}
      className="max-w-full"
    >
      {players.map((player) => (
        <SelectItem key={player.id}>{player.fullName}</SelectItem>
      ))}
    </Select>
  );
}

