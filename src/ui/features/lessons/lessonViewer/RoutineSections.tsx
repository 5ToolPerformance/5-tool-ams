"use client";

import { Chip } from "@heroui/react";
import { Workflow } from "lucide-react";

import {
  LessonDrillData,
  LessonMechanicData,
  LessonPlayerRoutineData,
} from "@/db/queries/lessons/lessonQueries.types";

import { LessonViewerSection } from "./LessonViewerSection";

type Props = {
  routines: LessonPlayerRoutineData[];
  mechanics: LessonMechanicData[];
  drills: LessonDrillData[];
};

export function RoutineSections({ routines, mechanics, drills }: Props) {
  if (routines.length === 0) {
    return null;
  }

  return (
    <LessonViewerSection
      title={`Routines (${routines.length})`}
      icon={<Workflow className="h-4 w-4" />}
    >
      <div className="space-y-5">
        {routines.map((routine) => {
          const mechanicById = new Map(
            mechanics.map((mechanic) => [mechanic.mechanicId, mechanic])
          );
          const drillById = new Map(drills.map((drill) => [drill.drillId, drill]));

          return (
            <div
              key={routine.id}
              className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {routine.sourceRoutineTitle}
                </h4>
                <Chip size="sm" variant="flat">
                  {routine.sourceRoutineSource === "player"
                    ? "Player routine"
                    : "Universal routine"}
                </Chip>
                <Chip size="sm" variant="flat">
                  {routine.sourceRoutineType === "full_lesson"
                    ? "Full lesson"
                    : "Partial lesson"}
                </Chip>
              </div>

              {routine.sourceRoutineDocument.mechanics.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Mechanics
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {routine.sourceRoutineDocument.mechanics.map((mechanic) => {
                      const lessonMechanic = mechanicById.get(mechanic.mechanicId);

                      return (
                        <div
                          key={mechanic.mechanicId}
                          className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900/40"
                        >
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            {lessonMechanic?.name ?? mechanic.title ?? mechanic.mechanicId}
                          </p>
                          {lessonMechanic?.notes && (
                            <p className="mt-2 text-sm italic text-zinc-600 dark:text-zinc-400">
                              {lessonMechanic.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {routine.sourceRoutineDocument.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900/40"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {block.title}
                      </p>
                      {block.notes && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {block.notes}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {block.drills.map((drill) => {
                        const lessonDrill = drillById.get(drill.drillId);

                        return (
                          <div
                            key={`${block.id}:${drill.drillId}`}
                            className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                          >
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                              {lessonDrill?.title ?? drill.title ?? drill.drillId}
                            </p>
                            {(lessonDrill?.notes ?? drill.notes) && (
                              <p className="mt-2 text-sm italic text-zinc-600 dark:text-zinc-400">
                                {lessonDrill?.notes ?? drill.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </LessonViewerSection>
  );
}
