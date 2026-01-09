"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

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

export function StepSelectPlayers() {
  const { form, ensurePlayers, players } = useLessonFormContext();

  // UI-only state to reset autocomplete input
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const { lessonDate, lessonType, selectedPlayerIds } = values;

        function addPlayer(playerId: string) {
          if (selectedPlayerIds.includes(playerId)) return;

          const next = [...selectedPlayerIds, playerId];
          form.setFieldValue("selectedPlayerIds", next);
          ensurePlayers(next);

          setAutocompleteKey((k) => k + 1);
        }

        function removePlayer(playerId: string) {
          form.setFieldValue(
            "selectedPlayerIds",
            selectedPlayerIds.filter((id) => id !== playerId)
          );
        }

        function toDateInputValue(value?: string) {
          if (!value) return "";
          return value.slice(0, 10); // YYYY-MM-DD
        }

        function fromDateInputValue(value: string) {
          if (!value) return undefined;
          return value; // keep as YYYY-MM-DD for now
        }

        const availablePlayers = players.filter(
          (p) => !selectedPlayerIds.includes(p.id)
        );

        const selectedPlayers = players.filter((p) =>
          selectedPlayerIds.includes(p.id)
        );

        return (
          <Card shadow="sm">
            <CardBody className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-lg font-semibold">Lesson Details</h2>
                <p className="text-sm text-foreground-500">
                  Select the lesson type, players, and date.
                </p>
              </div>

              {/* Lesson Type */}
              <Select
                label="Lesson Type"
                placeholder="Select a lesson type"
                selectedKeys={lessonType ? [lessonType] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  form.setFieldValue("lessonType", value as LessonType);
                }}
                isRequired
              >
                {LESSON_TYPES.map((type) => (
                  <SelectItem key={type.value} textValue={type.label}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              {/* Player Selector */}
              <div className="space-y-2">
                <Autocomplete
                  key={autocompleteKey}
                  label="Add Players"
                  placeholder="Search players…"
                  onSelectionChange={(key) => {
                    if (typeof key === "string") {
                      addPlayer(key);
                    }
                  }}
                >
                  {availablePlayers.map((player) => (
                    <AutocompleteItem
                      key={player.id}
                      textValue={`${player.firstName} ${player.lastName}`}
                    >
                      {player.firstName} {player.lastName}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>

                {/* Selected Players */}
                {selectedPlayers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPlayers.map((player) => (
                      <Chip
                        key={player.id}
                        onClose={() => removePlayer(player.id)}
                        variant="flat"
                      >
                        {player.firstName} {player.lastName}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>

              {/* Lesson Date */}
              <Input
                type="date"
                label="Lesson Date"
                value={toDateInputValue(lessonDate) ?? ""}
                onChange={(e) =>
                  form.setFieldValue(
                    "lessonDate",
                    fromDateInputValue(e.target.value)
                  )
                }
                isRequired
              />
            </CardBody>
          </Card>
        );
      }}
    </form.Subscribe>
  );
}
