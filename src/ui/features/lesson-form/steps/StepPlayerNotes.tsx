"use client";

import { useLessonFormContext } from "../LessonFormProvider";
import { LESSON_TYPE_REGISTRY } from "../lessonTypes";

const MECHANICS = [
  { id: "m1", label: "Hip-Shoulder Separation" },
  { id: "m2", label: "Arm Path Efficiency" },
  { id: "m3", label: "Ground Force Usage" },
];

export function StepPlayerNotes() {
  const { form, ensurePlayer } = useLessonFormContext();

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const { selectedPlayerIds, players, lessonType } = values;

        if (selectedPlayerIds.length === 0) {
          return <p>No players selected.</p>;
        }

        const lessonImpl = lessonType && LESSON_TYPE_REGISTRY[lessonType];

        return (
          <div>
            <h2>Player Notes</h2>

            {selectedPlayerIds.map((playerId) => {
              // Guarantee structure (idempotent)
              ensurePlayer(playerId);

              const playerData = players[playerId] ?? {};
              const notes = playerData.notes ?? "";
              const mechanics = playerData.mechanics ?? [];

              function updateNotes(e: React.ChangeEvent<HTMLTextAreaElement>) {
                form.setFieldValue(`players.${playerId}.notes`, e.target.value);
              }

              function toggleMechanic(mechanicId: string) {
                const next = mechanics.includes(mechanicId)
                  ? mechanics.filter((id) => id !== mechanicId)
                  : [...mechanics, mechanicId];

                form.setFieldValue(`players.${playerId}.mechanics`, next);
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
                  <h3>Player {playerId}</h3>

                  {lessonImpl && <lessonImpl.PlayerNotes playerId={playerId} />}

                  {/* Notes */}
                  <div style={{ marginBottom: 12 }}>
                    <label>
                      Notes
                      <textarea
                        value={notes}
                        onChange={updateNotes}
                        rows={4}
                        style={{ width: "100%" }}
                      />
                    </label>
                  </div>

                  {/* Mechanics */}
                  <div>
                    <p>Mechanics Worked</p>

                    {MECHANICS.map((m) => (
                      <label key={m.id} style={{ display: "block" }}>
                        <input
                          type="checkbox"
                          checked={mechanics.includes(m.id)}
                          onChange={() => toggleMechanic(m.id)}
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>

                  {/* Video placeholder */}
                  <div style={{ marginTop: 12 }}>
                    <em>Video upload (coming later)</em>
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
