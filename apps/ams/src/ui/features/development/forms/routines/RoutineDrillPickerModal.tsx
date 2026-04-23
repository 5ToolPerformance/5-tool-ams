"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Checkbox,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { Search } from "lucide-react";

import type { RoutineDrillOption } from "@ams/application/routines/getRoutineFormConfig";
import { DrillForm } from "@/ui/features/drills/DrillForm";
import type { Drill } from "@/ui/features/drills/types";

type RoutineDrillPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drillIds: string[]) => void;
  onDrillCreated: (drill: RoutineDrillOption) => void;
  drillOptions: RoutineDrillOption[];
  existingDrillIds: string[];
  initialDisciplineKey?: RoutineDrillOption["discipline"] | null;
};

const DISCIPLINE_LABELS: Record<RoutineDrillOption["discipline"], string> = {
  arm_care: "Arm Care",
  catching: "Catching",
  fielding: "Fielding",
  hitting: "Hitting",
  pitching: "Pitching",
  strength: "Strength",
};

type FilterKey = "all" | RoutineDrillOption["discipline"];

export function RoutineDrillPickerModal({
  isOpen,
  onClose,
  onAdd,
  onDrillCreated,
  drillOptions,
  existingDrillIds,
  initialDisciplineKey,
}: RoutineDrillPickerModalProps) {
  const [query, setQuery] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState<FilterKey>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"select" | "create">("select");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMode("select");
  }, [initialDisciplineKey, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIds([]);
      setDisciplineFilter(initialDisciplineKey ?? "all");
    }
  }, [initialDisciplineKey, isOpen]);

  const existingIdSet = useMemo(() => new Set(existingDrillIds), [existingDrillIds]);

  const disciplineOptions = useMemo(() => {
    return Array.from(new Set(drillOptions.map((drill) => drill.discipline))).sort((a, b) =>
      DISCIPLINE_LABELS[a].localeCompare(DISCIPLINE_LABELS[b])
    );
  }, [drillOptions]);

  const filteredDrills = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return drillOptions
      .filter((drill) => !existingIdSet.has(drill.id))
      .filter((drill) => {
        const matchesDiscipline =
          disciplineFilter === "all" || drill.discipline === disciplineFilter;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          drill.title.toLowerCase().includes(normalizedQuery) ||
          drill.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

        return matchesDiscipline && matchesQuery;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [disciplineFilter, drillOptions, existingIdSet, query]);

  function toggleSelection(drillId: string, isSelected: boolean) {
    setSelectedIds((prev) => {
      if (isSelected) {
        return prev.includes(drillId) ? prev : [...prev, drillId];
      }

      return prev.filter((id) => id !== drillId);
    });
  }

  function handleAdd() {
    onAdd(selectedIds);
    onClose();
  }

  async function handleDrillCreated(drill: Drill) {
    const nextDrill = {
      id: drill.id,
      title: drill.title,
      description: drill.description,
      discipline: drill.discipline,
      tags: drill.tags,
    } satisfies RoutineDrillOption;

    onDrillCreated(nextDrill);

    setSelectedIds((prev) => (prev.includes(drill.id) ? prev : [...prev, drill.id]));
    setMode("select");

    if (query.trim().length > 0) {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        drill.title.toLowerCase().includes(normalizedQuery) ||
        drill.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      if (!matchesQuery) {
        setQuery("");
      }
    }

    if (disciplineFilter !== "all" && disciplineFilter !== drill.discipline) {
      setDisciplineFilter(drill.discipline);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>{mode === "create" ? "Create Drill" : "Add Drills"}</ModalHeader>
        <ModalBody className="space-y-4">
          {mode === "create" ? (
            <DrillForm
              mode="create"
              initialDiscipline={initialDisciplineKey ?? undefined}
              onSaved={handleDrillCreated}
              onCancel={() => setMode("select")}
              hideHeader
            />
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  aria-label="Search drills"
                  placeholder="Search drills by name or tag"
                  startContent={<Search className="h-4 w-4 text-default-400" />}
                  value={query}
                  onValueChange={setQuery}
                />

                <Select
                  aria-label="Filter by discipline"
                  className="sm:max-w-52"
                  selectedKeys={new Set([disciplineFilter])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setDisciplineFilter(
                      typeof selected === "string" ? (selected as FilterKey) : "all"
                    );
                  }}
                >
                  <>
                    <SelectItem key="all">All Disciplines</SelectItem>
                    {disciplineOptions.map((discipline) => (
                      <SelectItem key={discipline}>
                        {DISCIPLINE_LABELS[discipline]}
                      </SelectItem>
                    ))}
                  </>
                </Select>

                <Button
                  className="sm:ml-auto"
                  variant="flat"
                  onPress={() => setMode("create")}
                >
                  Create Drill
                </Button>
              </div>

              <p className="text-sm text-default-500">
                {selectedIds.length} selected
                {existingDrillIds.length > 0
                  ? ` | ${existingDrillIds.length} already in this block`
                  : ""}
              </p>

              {filteredDrills.length === 0 ? (
                <div className="rounded-medium border border-dashed px-4 py-8 text-center text-sm text-default-500">
                  No drills match the current filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {filteredDrills.map((drill) => {
                    const isSelected = selectedIds.includes(drill.id);

                    return (
                      <label
                        key={drill.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-large border p-4 transition ${
                          isSelected
                            ? "border-primary bg-primary-50"
                            : "border-default-200 bg-content1 hover:border-default-300"
                        }`}
                      >
                        <Checkbox
                          isSelected={isSelected}
                          onValueChange={(checked) => toggleSelection(drill.id, checked)}
                        />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{drill.title}</p>
                            <p className="text-sm text-default-500">{drill.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Chip size="sm" variant="flat" color="secondary">
                              {DISCIPLINE_LABELS[drill.discipline]}
                            </Chip>
                            {drill.tags.map((tag) => (
                              <Chip key={`${drill.id}-${tag}`} size="sm" variant="flat">
                                {tag}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {mode === "create" ? null : (
            <>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleAdd} isDisabled={selectedIds.length === 0}>
                Add
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
