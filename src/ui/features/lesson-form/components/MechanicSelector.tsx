"use client";

import { useMemo } from "react";

import {
  Accordion,
  AccordionItem,
  Checkbox,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { InfoIcon } from "lucide-react";

import {
  LessonFormMechanic,
  useLessonFormContext,
} from "../LessonFormProvider";

type MechanicSelectorProps = {
  playerId: string;
  mechanics: LessonFormMechanic[];
};

export function MechanicSelector({
  playerId,
  mechanics,
}: MechanicSelectorProps) {
  const { form } = useLessonFormContext();

  // Current mechanic selections for this player
  const mechanicMap = form.getFieldValue(`players.${playerId}.mechanics`) ?? {};

  function getMechanicTags(mechanic: LessonFormMechanic): string[] {
    if (!mechanic.tags || mechanic.tags.length === 0) {
      return ["Other"];
    }
    return mechanic.tags;
  }

  /**
   * Group mechanics by tag
   */
  const mechanicsByTag = useMemo(() => {
    const map: Record<string, LessonFormMechanic[]> = {};

    mechanics.forEach((mechanic) => {
      const tags = getMechanicTags(mechanic);

      tags.forEach((tag) => {
        if (!map[tag]) {
          map[tag] = [];
        }
        map[tag].push(mechanic);
      });
    });

    // Add "All" last
    map["All"] = mechanics;

    return map;
  }, [mechanics]);

  /**
   * Sort tags so "All" is always last
   */
  const orderedTags = useMemo(() => {
    return Object.keys(mechanicsByTag).sort((a, b) => {
      if (a === "All") return 1;
      if (b === "All") return -1;
      return a.localeCompare(b);
    });
  }, [mechanicsByTag]);

  function toggleMechanic(mechanicId: string) {
    if (mechanicMap[mechanicId]) {
      const { [mechanicId]: _, ...rest } = mechanicMap; // eslint-disable-line @typescript-eslint/no-unused-vars
      form.setFieldValue(`players.${playerId}.mechanics`, rest);
    } else {
      form.setFieldValue(`players.${playerId}.mechanics.${mechanicId}`, {});
    }
  }

  function updateNotes(mechanicId: string, notes: string) {
    form.setFieldValue(
      `players.${playerId}.mechanics.${mechanicId}.notes`,
      notes
    );
  }

  return (
    <Accordion variant="splitted" selectionMode="multiple" className="mt-2">
      {orderedTags.map((tag) => {
        const tagMechanics = mechanicsByTag[tag];

        return (
          <AccordionItem key={tag} aria-label={tag} title={tag}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tagMechanics.map((mechanic) => {
                const entry = mechanicMap[mechanic.id];
                const isSelected = !!entry;

                return (
                  <div
                    key={mechanic.id}
                    className="flex flex-col gap-2 rounded-md border border-default-200 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        isSelected={isSelected}
                        onValueChange={() => toggleMechanic(mechanic.id)}
                      >
                        {mechanic.name}
                      </Checkbox>

                      {mechanic.description && (
                        <Tooltip
                          content={mechanic.description}
                          placement="right"
                        >
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
                        onChange={(e) =>
                          updateNotes(mechanic.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
