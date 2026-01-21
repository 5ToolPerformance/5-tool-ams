"use client";

import { useEffect } from "react";

import { Card, CardBody, Textarea } from "@heroui/react";

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
          return (
            <p className="text-sm text-foreground-500">
              Please select a lesson type.
            </p>
          );
        }

        const lessonImpl = LESSON_TYPE_REGISTRY[lessonType] ?? null;

        /**
         * Filter mechanics based on lesson type
         */
        const availableMechanics = mechanics.filter((m) => {
          if (m.type === null) return true;

          if (lessonImpl?.allowedMechanicTypes) {
            return lessonImpl.allowedMechanicTypes.includes(m.type);
          }

          return m.type === lessonType;
        });

        return (
          <div className="space-y-6">
            {/* Step Header */}
            <div>
              <h2 className="text-lg font-semibold">Player Notes</h2>
              <p className="text-sm text-foreground-500">
                Add notes and mechanics for each player.
              </p>
            </div>

            {/* Player Cards */}
            {selectedPlayerIds.map((playerId) => {
              const player = players[playerId] ?? {};
              const playerName = playerById[playerId] ?? `Player ${playerId}`;

              return (
                <Card key={playerId} shadow="sm">
                  <CardBody className="space-y-6">
                    {/* Player Name */}
                    <h3 className="text-base font-semibold">{playerName}</h3>

                    {/* Base Notes */}
                    <Textarea
                      label="General Notes"
                      placeholder="Notes for this player…"
                      minRows={3}
                      value={player.notes ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(
                          `players.${playerId}.notes`,
                          e.target.value
                        )
                      }
                    />

                    {/* Lesson-type–specific notes */}
                    {lessonImpl?.PlayerNotes && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {lessonImpl.label} Details
                        </p>
                        <lessonImpl.PlayerNotes playerId={playerId} />
                      </div>
                    )}

                    {/* Mechanics */}
                    {lessonImpl?.allowedMechanicTypes &&
                      lessonImpl.allowedMechanicTypes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Mechanics Worked
                          </p>
                          <MechanicSelector
                            playerId={playerId}
                            mechanics={availableMechanics}
                          />
                        </div>
                      )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        );
      }}
    </form.Subscribe>
  );
}
