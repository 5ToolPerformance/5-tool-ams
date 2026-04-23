"use client";

import {
  Accordion,
  AccordionItem,
  Checkbox,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { InfoIcon } from "lucide-react";

import { LessonFormDrill, useLessonFormContext } from "../LessonFormProvider";

type DrillSelectorProps = {
  playerId: string;
  drills: LessonFormDrill[];
};

export function DrillSelector({ playerId, drills }: DrillSelectorProps) {
  const { form } = useLessonFormContext();

  // Current drill selections for this player
  const drillMap = form.getFieldValue(`players.${playerId}.drills`) ?? {};

  function toggleDrill(drillId: string) {
    if (drillMap[drillId]) {
      const { [drillId]: _, ...rest } = drillMap; // eslint-disable-line @typescript-eslint/no-unused-vars
      form.setFieldValue(`players.${playerId}.drills`, rest);
    } else {
      form.setFieldValue(`players.${playerId}.drills.${drillId}`, {});
    }
  }

  function updateNotes(drillId: string, notes: string) {
    form.setFieldValue(`players.${playerId}.drills.${drillId}.notes`, notes);
  }

  return (
    <Accordion variant="splitted" selectionMode="multiple" className="mt-2">
      <AccordionItem key="Drills" aria-label="Drills" title="Drills">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {drills.map((drill) => {
            const entry = drillMap[drill.id];
            const isSelected = !!entry;

            return (
              <div
                key={drill.id}
                className="flex flex-col gap-2 rounded-md border border-default-200 p-3"
              >
                <div className="flex items-start gap-2">
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={() => toggleDrill(drill.id)}
                  >
                    {drill.title}
                  </Checkbox>

                  {drill.description && (
                    <Tooltip content={drill.description} placement="right">
                      <InfoIcon className="h-4 w-4 cursor-pointer text-default-400" />
                    </Tooltip>
                  )}
                </div>

                {/* Optional notes */}
                {isSelected && (
                  <Textarea
                    size="sm"
                    minRows={2}
                    placeholder="Optional clarification…"
                    value={entry.notes ?? ""}
                    onChange={(e) => updateNotes(drill.id, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
