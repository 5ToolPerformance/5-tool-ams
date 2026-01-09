"use client";

import { Button, Card, CardBody } from "@heroui/react";

import { PitchingLessonData } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";
import { LESSON_TYPE_REGISTRY } from "../lessonTypes";

export function StepConfirm() {
  const { form, submit, isSubmitting, playerById, mechanicById } =
    useLessonFormContext();

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const {
          lessonType,
          lessonDate,
          selectedPlayerIds,
          players,
          sharedNotes,
        } = values;

        const lessonImpl = lessonType ? LESSON_TYPE_REGISTRY[lessonType] : null;

        return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-lg font-semibold">Review & Confirm Lesson</h2>
              <p className="text-sm text-foreground-500">
                Review the lesson details below before saving.
              </p>
            </div>

            {/* Lesson Overview */}
            <Card shadow="sm">
              <CardBody className="space-y-3">
                <h3 className="text-base font-semibold">Lesson Details</h3>

                <p>
                  <strong>Lesson Type:</strong> {lessonType ?? "—"}
                </p>

                <p>
                  <strong>Date:</strong> {lessonDate ?? "—"}
                </p>

                <p>
                  <strong>Players:</strong>{" "}
                  {selectedPlayerIds
                    .map((id) => playerById[id] ?? id)
                    .join(", ") || "—"}
                </p>
              </CardBody>
            </Card>

            {/* Player Summaries */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Player Summaries</h3>

              {selectedPlayerIds.map((playerId) => {
                const player = players[playerId];
                if (!player) return null;

                const playerName = playerById[playerId] ?? `Player ${playerId}`;

                const mechanics = player.mechanics ?? {};

                return (
                  <Card key={playerId} shadow="sm">
                    <CardBody className="space-y-4">
                      <h4 className="font-semibold">{playerName}</h4>

                      {/* General Notes */}
                      <div>
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-foreground-600">
                          {player.notes || "—"}
                        </p>
                      </div>

                      {/* Lesson-type–specific */}
                      {lessonImpl?.Review && player.lessonSpecific && (
                        <div>
                          <p className="text-sm font-medium">
                            {lessonImpl.label} Details
                          </p>
                          <lessonImpl.Review
                            data={player.lessonSpecific as PitchingLessonData}
                          />
                        </div>
                      )}

                      {/* Mechanics */}
                      <div>
                        <p className="text-sm font-medium">Mechanics Worked</p>

                        {Object.keys(mechanics).length === 0 && (
                          <p className="text-sm text-foreground-500">—</p>
                        )}

                        <ul className="space-y-2">
                          {Object.entries(mechanics).map(
                            ([mechanicId, entry]) => (
                              <li key={mechanicId} className="text-sm">
                                <strong>
                                  {mechanicById[mechanicId]?.name ?? mechanicId}
                                </strong>

                                {entry.notes && (
                                  <div className="ml-3 text-foreground-500">
                                    {entry.notes}
                                  </div>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {/* Shared Notes */}
            <Card shadow="sm">
              <CardBody className="space-y-3">
                <h3 className="text-base font-semibold">Shared Notes</h3>

                <p className="text-sm text-foreground-600">
                  {sharedNotes?.general || "—"}
                </p>
              </CardBody>
            </Card>

            {/* Action */}
            <div className="flex justify-end pt-4">
              <Button color="primary" onPress={submit} isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Confirm & Save"}
              </Button>
            </div>
          </div>
        );
      }}
    </form.Subscribe>
  );
}
