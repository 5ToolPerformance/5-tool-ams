"use client";

import { Checkbox, Chip } from "@heroui/react";

import { useLessonFormContext } from "../LessonFormProvider";

type RoutineSelectorProps = {
  playerId: string;
};

export function RoutineSelector({ playerId }: RoutineSelectorProps) {
  const { form, getAvailableRoutines } = useLessonFormContext();
  const lessonType = form.getFieldValue("lessonType");
  const selections = form.getFieldValue(`players.${playerId}.routineSelections`) ?? [];
  const routines = getAvailableRoutines(playerId, lessonType);
  const { toggleRoutineSelection } = useLessonFormContext();

  if (!lessonType) {
    return null;
  }

  if (routines.length === 0) {
    return (
      <p className="text-sm text-foreground-500">
        No player or universal routines are available for this lesson type.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {routines.map((routine) => {
        const isSelected = selections.some(
          (selection) =>
            selection.source === routine.source && selection.routineId === routine.routineId
        );

        return (
          <div
            key={routine.key}
            className="flex items-start justify-between gap-3 rounded-md border border-default-200 p-3"
          >
            <div className="space-y-2">
              <Checkbox
                isSelected={isSelected}
                onValueChange={() => toggleRoutineSelection(playerId, routine)}
              >
                {routine.title}
              </Checkbox>
              <div className="flex flex-wrap gap-2">
                <Chip size="sm" variant="flat">
                  {routine.routineType === "full_lesson" ? "Full Lesson" : "Partial Lesson"}
                </Chip>
                <Chip size="sm" variant="flat">
                  {routine.source === "player" ? "Player Routine" : "Universal Routine"}
                </Chip>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
