"use client";

import { useLessonFormContext } from "../LessonFormProvider";

export function StepConfirm() {
  const { form, submit, isSubmitting } = useLessonFormContext();

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const { lessonType, selectedPlayerIds, players, sharedNotes } = values;

        return (
          <div>
            <h2>Confirm Lesson</h2>

            {/* Lesson Overview */}
            <section style={{ marginBottom: 24 }}>
              <h3>Lesson Details</h3>
              <p>
                <strong>Lesson Type:</strong> {lessonType ?? "—"}
              </p>
              <p>
                <strong>Players:</strong> {selectedPlayerIds.join(", ") || "—"}
              </p>
            </section>

            {/* Per-player Summary */}
            <section style={{ marginBottom: 24 }}>
              <h3>Player Notes</h3>

              {selectedPlayerIds.map((playerId) => {
                const player = players[playerId];

                if (!player) return null;

                return (
                  <div
                    key={playerId}
                    style={{
                      border: "1px solid #333",
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <h4>Player {playerId}</h4>

                    <p>
                      <strong>Notes:</strong> {player.notes || "—"}
                    </p>

                    <p>
                      <strong>Mechanics:</strong>{" "}
                      {player.mechanics?.length
                        ? player.mechanics.join(", ")
                        : "—"}
                    </p>

                    {player.videoAssetId && (
                      <p>
                        <strong>Video:</strong> {player.videoAssetId}
                      </p>
                    )}
                  </div>
                );
              })}
            </section>

            {/* Shared Notes */}
            <section style={{ marginBottom: 24 }}>
              <h3>Shared Notes</h3>

              <p>
                <strong>General:</strong> {sharedNotes?.general || "—"}
              </p>

              <p>
                <strong>Drills:</strong> {sharedNotes?.drills || "—"}
              </p>
            </section>

            {/* Actions */}
            <div>
              <button type="button" onClick={submit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        );
      }}
    </form.Subscribe>
  );
}
