"use client";

import { useEffect } from "react";

import { useLessonFormContext } from "../LessonFormProvider";
import { LESSON_TYPE_REGISTRY } from "../lessonTypes";

/**
 * Temporary mechanics source.
 * Replace with real data later.
 */
type Mechanic = {
  id: string;
  name: string;
  type: "pitching" | "hitting" | "fielding";
};

const MECHANICS: Mechanic[] = [
  { id: "m1", name: "Hip–Shoulder Separation", type: "pitching" },
  { id: "m2", name: "Arm Path Efficiency", type: "pitching" },
  { id: "m3", name: "Ground Force Usage", type: "pitching" },
  { id: "m4", name: "Bat Speed", type: "hitting" },
];

export function StepPlayerNotes() {
  const { form, ensurePlayer, playerById } = useLessonFormContext();

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

        const lessonImpl = LESSON_TYPE_REGISTRY[lessonType];

        /**
         * Filter mechanics based on lesson type
         */
        const availableMechanics = lessonImpl
          ? MECHANICS.filter((m) =>
              lessonImpl.allowedMechanicTypes.includes(m.type)
            )
          : [];

        return (
          <div>
            <h2>Player Notes</h2>

            {selectedPlayerIds.map((playerId) => {
              const player = players[playerId] ?? {};
              const mechanicMap = player.mechanics ?? {};

              const playerName = playerById[playerId] || `Player ${playerId}`;

              /**
               * Toggle mechanic selection
               */
              function toggleMechanic(mechanicId: string) {
                if (mechanicMap[mechanicId]) {
                  // deselect → remove entry
                  const { [mechanicId]: _, ...rest } = mechanicMap;

                  form.setFieldValue(`players.${playerId}.mechanics`, rest);
                } else {
                  // select → create empty metadata
                  form.setFieldValue(
                    `players.${playerId}.mechanics.${mechanicId}`,
                    {}
                  );
                }
              }

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
                  {lessonImpl && <lessonImpl.PlayerNotes playerId={playerId} />}

                  {/* Mechanics */}
                  <div style={{ marginTop: 12 }}>
                    <h4>Mechanics Worked</h4>

                    {availableMechanics.length === 0 && (
                      <p>No mechanics available.</p>
                    )}

                    {availableMechanics.map((mechanic) => {
                      const entry = mechanicMap[mechanic.id];
                      const isSelected = !!entry;

                      return (
                        <div key={mechanic.id} style={{ marginBottom: 8 }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleMechanic(mechanic.id)}
                            />
                            {mechanic.name}
                          </label>

                          {/* Optional mechanic notes */}
                          {isSelected && (
                            <div
                              style={{
                                marginLeft: 24,
                                marginTop: 4,
                              }}
                            >
                              <textarea
                                rows={2}
                                placeholder="Optional clarification…"
                                style={{ width: "100%" }}
                                value={entry.notes ?? ""}
                                onChange={(e) =>
                                  form.setFieldValue(
                                    `players.${playerId}.mechanics.${mechanic.id}.notes`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    </form.Subscribe>
  );
}
