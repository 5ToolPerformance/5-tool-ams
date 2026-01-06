"use client";

import { useEffect } from "react";

import { useLessonFormContext } from "../LessonFormProvider";
import { MechanicSelector } from "../components/MechanicSelector";
import { LESSON_TYPE_REGISTRY } from "../lessonTypes";

export function StepPlayerNotes() {
  const { form, ensurePlayer, playerById, mechanics } = useLessonFormContext();

  /**
   * Ensure player nodes exist when this step mounts.
   * IMPORTANT: this runs in an effect, not during render.
   */
  useEffect(() => {
    const values = form.state.values;
    values.selectedPlayerIds.forEach((id) => {
      ensurePlayer(id);
    });
  }, [form, ensurePlayer]);

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const { lessonType, selectedPlayerIds, players } = values;

        if (!lessonType) {
          return <p>Please select a lesson type.</p>;
        }

        const lessonImpl = LESSON_TYPE_REGISTRY[lessonType] ?? null;

        /**
         * Filter mechanics based on lesson type
         */
        const availableMechanics = mechanics.filter((m) => {
          if (m.type === null) return true;

          // If there's a registry override, respect it
          if (lessonImpl?.allowedMechanicTypes) {
            return lessonImpl.allowedMechanicTypes.includes(m.type);
          }

          // Default behavior: match lesson type
          return m.type === lessonType;
        });

        return (
          <div>
            <h2>Player Notes</h2>

            {selectedPlayerIds.map((playerId) => {
              const player = players[playerId] ?? {};

              const playerName = playerById[playerId] || `Player ${playerId}`;

              return (
                <div
                  key={playerId}
                  style={{
                    border: "1px solid #333",
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <h3>{playerName}</h3>

                  {/* Base Notes */}
                  <div style={{ marginBottom: 12 }}>
                    <label>
                      Notes
                      <textarea
                        rows={3}
                        style={{ width: "100%" }}
                        value={player.notes ?? ""}
                        onChange={(e) =>
                          form.setFieldValue(
                            `players.${playerId}.notes`,
                            e.target.value
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Lesson-type–specific notes */}
                  {lessonImpl?.PlayerNotes && (
                    <lessonImpl.PlayerNotes playerId={playerId} />
                  )}

                  {/* Mechanics */}
                  <MechanicSelector
                    playerId={playerId}
                    mechanics={availableMechanics}
                  />
                </div>
              );
            })}
          </div>
        );
      }}
    </form.Subscribe>
  );
}
