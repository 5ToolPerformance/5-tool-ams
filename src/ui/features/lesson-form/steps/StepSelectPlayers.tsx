"use client";

import React from "react";

import { LessonType } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";

const LESSON_TYPES = [
  { value: "pitching", label: "Pitching" },
  { value: "hitting", label: "Hitting" },
  { value: "fielding", label: "Fielding" },
  { value: "strength", label: "Strength & Conditioning" },
  { value: "catching", label: "Catching" },
] as const satisfies ReadonlyArray<{ value: LessonType; label: string }>;

//PLACEHOLDER
const PLAYERS = [
  { id: "p1", name: "Player 1" },
  { id: "p2", name: "Player 2" },
  { id: "p3", name: "Player 3" },
];

export function StepSelectPlayers() {
  const { form, ensurePlayers } = useLessonFormContext();

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

        function togglePlayer(playerId: string) {
          const nextIds = selectedPlayerIds.includes(playerId)
            ? selectedPlayerIds.filter((id) => id !== playerId)
            : [...selectedPlayerIds, playerId];

          form.setFieldValue("selectedPlayerIds", nextIds);
          ensurePlayers(nextIds);
        }

        function updateDate(event: React.ChangeEvent<HTMLInputElement>) {
          const { value } = event.target;
          form.setFieldValue("lessonDate", value);
        }

        return (
          <div>
            <h2>Select Lesson Details</h2>

            <label>
              Lesson Type
              <select
                value={lessonType ?? ""}
                onChange={handleLessonTypeChange}
              >
                <option value="" disabled>
                  Select a lesson type
                </option>
                <option value="pitching">Pitching</option>
                <option value="hitting">Hitting</option>
                <option value="fielding">Fielding</option>
                <option value="strength">Strength</option>
              </select>
            </label>

            <div style={{ marginTop: 16 }}>
              <p>Select Players</p>

              {["p1", "p2", "p3"].map((id) => (
                <label key={id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={selectedPlayerIds.includes(id)}
                    onChange={() => togglePlayer(id)}
                  />
                  Player {id}
                </label>
              ))}
            </div>
            <div>
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
