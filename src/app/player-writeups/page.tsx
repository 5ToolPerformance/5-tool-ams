// app/(dashboard)/writeups/batch/page.tsx
"use client";

import { useMemo, useState } from "react";

// Assuming you have this
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { usePlayers } from "@/hooks";
import { PlayerSelect } from "@/types/database";

// app/(dashboard)/writeups/batch/page.tsx

// app/(dashboard)/writeups/batch/page.tsx

const WRITEUP_TYPES = [
  { value: "mid_package", label: "Mid Package" },
  { value: "end_package", label: "End Package" },
  { value: "end_of_year", label: "End of Year" },
] as const;

export default function BatchWriteupsPage() {
  const { players, isLoading: playersLoading } = usePlayers();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter players based on search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players as PlayerSelect[];

    const query = searchQuery.toLowerCase();
    return (players as PlayerSelect[]).filter((player: PlayerSelect) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [players, searchQuery]);

  const form = useForm({
    defaultValues: {
      playerIds: [],
      writeupType: "",
      writeupDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
    onSubmit: async ({ value }) => {
      if (selectedPlayerIds.size === 0) {
        toast.error("Please select at least one player");
        return;
      }
      if (!value.writeupType) {
        toast.error("Please select a writeup type");
        return;
      }

      try {
        const response = await fetch("/api/writeups/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerIds: Array.from(selectedPlayerIds),
            writeupType: value.writeupType,
            writeupDate: value.writeupDate,
            notes: value.notes || undefined,
          }),
        });

        if (!response.ok) throw new Error("Failed to create writeups");

        const result = await response.json();
        toast.success(
          `Successfully added writeups for ${result.count} players`
        );

        // Reset form
        setSelectedPlayerIds(new Set());
        form.reset();
      } catch (error) {
        toast.error("Failed to create writeups");
        console.error(error);
      }
    },
  });

  const togglePlayer = (playerId: string) => {
    const newSet = new Set(selectedPlayerIds);
    if (newSet.has(playerId)) {
      newSet.delete(playerId);
    } else {
      newSet.add(playerId);
    }
    setSelectedPlayerIds(newSet);
  };

  const toggleAll = () => {
    // Toggle all FILTERED players (not all players)
    const filteredIds = new Set(
      filteredPlayers.map((p: { id: string }) => p.id)
    );
    const allFilteredSelected = filteredPlayers.every((p: { id: string }) =>
      selectedPlayerIds.has(p.id)
    );

    if (allFilteredSelected) {
      // Deselect all filtered players
      const newSet = new Set(selectedPlayerIds);
      filteredIds.forEach((id) => newSet.delete(id));
      setSelectedPlayerIds(newSet);
    } else {
      // Select all filtered players
      const newSet = new Set(selectedPlayerIds);
      filteredIds.forEach((id) => newSet.add(id));
      setSelectedPlayerIds(newSet);
    }
  };

  if (playersLoading) {
    return <div>Loading players...</div>;
  }

  const allFilteredSelected =
    filteredPlayers.length > 0 &&
    filteredPlayers.every((p: any) => selectedPlayerIds.has(p.id));

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Batch Add Writeups</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Player Selection */}
        <Card>
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Select Players ({selectedPlayerIds.size} selected)
              </h2>
              <Button size="sm" variant="flat" onPress={toggleAll}>
                {allFilteredSelected ? "Deselect All" : "Select All"}
              </Button>
            </div>

            {/* Search Input */}
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              isClearable
              onClear={() => setSearchQuery("")}
              className="mb-4"
            />

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredPlayers.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                  No players found
                </div>
              ) : (
                filteredPlayers.map((player: any) => (
                  <label
                    key={player.id}
                    className="flex cursor-pointer items-center rounded-lg border border-transparent p-3 hover:border-gray-200 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlayerIds.has(player.id)}
                      onChange={() => togglePlayer(player.id)}
                      className="mr-3 h-4 w-4"
                    />
                    <span>
                      {player.firstName} {player.lastName}
                    </span>
                  </label>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* Writeup Details */}
        <Card>
          <CardBody>
            <h2 className="mb-4 text-lg font-semibold">Writeup Details</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field name="writeupType">
                {(field) => (
                  <Select
                    label="Writeup Type"
                    placeholder="Select writeup type"
                    selectedKeys={field.state.value ? [field.state.value] : []}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                    isRequired
                  >
                    {WRITEUP_TYPES.map((type) => (
                      <SelectItem key={type.value}>{type.label}</SelectItem>
                    ))}
                  </Select>
                )}
              </form.Field>

              <form.Field name="writeupDate">
                {(field) => (
                  <Input
                    type="date"
                    label="Date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    isRequired
                  />
                )}
              </form.Field>

              <form.Field name="notes">
                {(field) => (
                  <Textarea
                    label="Notes (Optional)"
                    placeholder="Add any additional notes..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>

              <Button
                type="submit"
                color="primary"
                isLoading={form.state.isSubmitting}
                fullWidth
                isDisabled={selectedPlayerIds.size === 0}
              >
                Add Writeups for {selectedPlayerIds.size} Player
                {selectedPlayerIds.size !== 1 ? "s" : ""}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
