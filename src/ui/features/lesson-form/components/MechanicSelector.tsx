"use client";

import { useMemo, useState } from "react";

import { Checkbox, Tab, Tabs, Textarea, Tooltip } from "@heroui/react";
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
  const [activeTag, setActiveTag] = useState<string>("All");

  // Current mechanic selections for this player
  const mechanicMap = form.getFieldValue(`players.${playerId}.mechanics`) ?? {};

  function getMechanicTags(mechanic: LessonFormMechanic): string[] {
    if (!mechanic.tags || mechanic.tags.length === 0) {
      return ["Other"];
    }
    return mechanic.tags;
  }

  /**
   * Derive available tags dynamically
   */
  const tags = useMemo(() => {
    const set = new Set<string>();

    mechanics.forEach((m) => {
      getMechanicTags(m).forEach((t) => set.add(t));
    });

    return ["All", ...Array.from(set)];
  }, [mechanics]);

  /**
   * Filter mechanics by active tab
   */
  const visibleMechanics = useMemo(() => {
    if (activeTag === "All") {
      return mechanics;
    }

    return mechanics.filter((m) => getMechanicTags(m).includes(activeTag));
  }, [mechanics, activeTag]);

  function toggleMechanic(mechanicId: string) {
    if (mechanicMap[mechanicId]) {
      const { [mechanicId]: _, ...rest } = mechanicMap;
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
    <div className="mt-4">
      <h4 className="mb-2">Mechanics Worked</h4>

      {/* Tag Tabs */}
      <Tabs
        selectedKey={activeTag}
        onSelectionChange={(key) => setActiveTag(key as string)}
        variant="underlined"
        size="sm"
      >
        {tags.map((tag) => (
          <Tab key={tag} title={tag} />
        ))}
      </Tabs>

      {/* Mechanic List */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMechanics.map((mechanic) => {
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
                  <Tooltip content={mechanic.description} placement="right">
                    <InfoIcon className="h-4 w-4 cursor-pointer text-default-400" />
                  </Tooltip>
                )}
              </div>

              {/* Optional notes (only when selected) */}
              {isSelected && (
                <div>
                  <Textarea
                    size="sm"
                    minRows={2}
                    placeholder="Optional clarification…"
                    value={entry.notes ?? ""}
                    onChange={(e) => updateNotes(mechanic.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
