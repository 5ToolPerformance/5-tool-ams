"use client";

import React, { useState } from "react";

import { Autocomplete, AutocompleteItem, Chip } from "@heroui/react";

import { LessonType } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";

const LESSON_TYPES = [
  { value: "pitching", label: "Pitching" },
  { value: "hitting", label: "Hitting" },
  { value: "fielding", label: "Fielding" },
  { value: "strength", label: "Strength & Conditioning" },
  { value: "catching", label: "Catching" },
] as const satisfies ReadonlyArray<{
  value: LessonType;
  label: string;
}>;

// PLACEHOLDER — later this comes from real data
const PLAYERS = [
  { id: "p1", name: "Player 1" },
  { id: "p2", name: "Player 2" },
  { id: "p3", name: "Player 3" },
];

export function StepSelectPlayers() {
  const { form, ensurePlayers } = useLessonFormContext();

  // Local UI-only state to reset autocomplete after selection
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const { lessonDate, lessonType, selectedPlayerIds } = values;

        function isLessonType(value: string): value is LessonType {
          return LESSON_TYPES.some((type) => type.value === value);
        }

        function handleLessonTypeChange(
          event: React.ChangeEvent<HTMLSelectElement>
        ) {
          const { value } = event.target;
          form.setFieldValue(
            "lessonType",
            isLessonType(value) ? value : undefined
          );
        }

        function addPlayer(playerId: string) {
          if (selectedPlayerIds.includes(playerId)) return;

          const next = [...selectedPlayerIds, playerId];
          form.setFieldValue("selectedPlayerIds", next);
          ensurePlayers(next);

          // Reset autocomplete input
          setAutocompleteKey((k) => k + 1);
        }

        function removePlayer(playerId: string) {
          const next = selectedPlayerIds.filter((id) => id !== playerId);
          form.setFieldValue("selectedPlayerIds", next);
        }

        function updateDate(event: React.ChangeEvent<HTMLInputElement>) {
          form.setFieldValue("lessonDate", event.target.value);
        }

        const selectedPlayers = PLAYERS.filter((p) =>
          selectedPlayerIds.includes(p.id)
        );

        const availablePlayers = PLAYERS.filter(
          (p) => !selectedPlayerIds.includes(p.id)
        );

        return (
          <div>
            <h2>Select Lesson Details</h2>

            {/* Lesson Type */}
            <label>
              Lesson Type
              <select
                value={lessonType ?? ""}
                onChange={handleLessonTypeChange}
              >
                <option value="" disabled>
                  Select a lesson type
                </option>
                {LESSON_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Player Selector */}
            <div style={{ marginTop: 16 }}>
              <p>Select Players</p>

              <Autocomplete
                key={autocompleteKey}
                aria-label="Select player"
                placeholder="Search players…"
                onSelectionChange={(key) => {
                  if (typeof key === "string") {
                    addPlayer(key);
                  }
                }}
              >
                {availablePlayers.map((player) => (
                  <AutocompleteItem key={player.id} textValue={player.name}>
                    {player.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              {/* Selected player chips */}
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {selectedPlayers.map((player) => (
                  <Chip
                    key={player.id}
                    onClose={() => removePlayer(player.id)}
                    variant="flat"
                  >
                    {player.name}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Lesson Date */}
            <div style={{ marginTop: 16 }}>
              <label>
                Lesson Date
                <input
                  type="date"
                  value={lessonDate ?? ""}
                  onChange={updateDate}
                />
              </label>
            </div>
          </div>
        );
      }}
    </form.Subscribe>
  );
}
