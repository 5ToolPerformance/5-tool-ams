"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";

import { usePlayers } from "@/hooks";

interface PlayerSelectorProps {
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string | null) => void;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

export function PlayerSelector({
  selectedPlayerId,
  onPlayerSelect,
  label = "Select Player",
  placeholder = "Search for a player...",
  isDisabled = false,
}: PlayerSelectorProps) {
  const { players, isLoading, error } = usePlayers();

  if (error) {
    return (
      <div className="text-sm text-danger">
        Failed to load players. Please try again.
      </div>
    );
  }

  return (
    <Autocomplete
      label={label}
      placeholder={placeholder}
      isLoading={isLoading}
      isDisabled={isDisabled}
      selectedKey={selectedPlayerId}
      onSelectionChange={(key) => onPlayerSelect(key as string | null)}
      className="w-full"
    >
      {(players || []).map((player) => (
        <AutocompleteItem
          key={player.id}
          textValue={`${player.firstName} ${player.lastName}`}
          startContent={
            <Avatar
              src={player.profilePictureUrl || undefined}
              name={`${player.firstName} ${player.lastName}`}
              size="sm"
            />
          }
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {player.firstName} {player.lastName}
            </span>
            <span className="text-xs text-default-500">
              {player.position} • {player.throws}HP
            </span>
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
