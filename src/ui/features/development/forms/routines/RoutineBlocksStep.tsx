"use client";

import {
  type DragEvent,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { GripVertical, StickyNote } from "lucide-react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineBlocksStep() {
  const {
    values,
    errors,
    availableDrillOptions,
    addBlock,
    updateBlock,
    reorderBlocks,
    removeBlock,
    addDrillToBlock,
    updateDrillInBlock,
    reorderDrillsInBlock,
    removeDrillFromBlock,
  } = useRoutineFormContext();
  const [draggingBlockIndex, setDraggingBlockIndex] = useState<number | null>(
    null
  );
  const [draggingDrill, setDraggingDrill] = useState<{
    blockIndex: number;
    drillIndex: number;
  } | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const expandedNoteKeys = useMemo(() => {
    const next: Record<string, boolean> = { ...expandedNotes };

    values.blocks.forEach((block) => {
      if (block.notes.trim()) {
        next[`block:${block.id}`] = true;
      }

      block.drills.forEach((drill) => {
        if (drill.notes.trim()) {
          next[`drill:${drill.id}`] = true;
        }
      });
    });

    return next;
  }, [expandedNotes, values.blocks]);

  function toggleNote(key: string) {
    setExpandedNotes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function allowDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
  }

  function onBlockDrop(targetIndex: number) {
    if (draggingBlockIndex === null) {
      return;
    }

    reorderBlocks(draggingBlockIndex, targetIndex);
    setDraggingBlockIndex(null);
  }

  function onDrillDrop(blockIndex: number, targetIndex: number) {
    if (!draggingDrill || draggingDrill.blockIndex !== blockIndex) {
      return;
    }

    reorderDrillsInBlock(blockIndex, draggingDrill.drillIndex, targetIndex);
    setDraggingDrill(null);
  }

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Blocks & Drills</h3>
        <p className="text-sm text-default-500">
          Drag blocks and drills into order, then add optional notes only where you need them.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Routine Blocks</p>
            <p className="text-xs text-default-500">
              Each block needs a title and at least one drill.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addBlock}>
            Add Block
          </Button>
        </div>

        {errors.blocks ? <p className="text-sm text-danger">{errors.blocks}</p> : null}

        {values.blocks.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No blocks added yet.
          </div>
        ) : (
          <div className="space-y-5">
            {values.blocks.map((block, blockIndex) => {
              const blockNoteKey = `block:${block.id}`;
              const isBlockNotesExpanded = Boolean(expandedNoteKeys[blockNoteKey]);

              return (
                <Card
                  key={block.id}
                  shadow="none"
                  className={`border ${draggingBlockIndex === blockIndex ? "opacity-60" : ""}`}
                  onDragOver={allowDrop}
                  onDrop={() => onBlockDrop(blockIndex)}
                >
                  <CardBody className="gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          draggable
                          aria-label={`Reorder block ${blockIndex + 1}`}
                          className="rounded-md border border-default-200 p-2 text-default-500 transition hover:bg-default-100"
                          onDragStart={() => setDraggingBlockIndex(blockIndex)}
                          onDragEnd={() => setDraggingBlockIndex(null)}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-medium">Block {blockIndex + 1}</p>
                      </div>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => removeBlock(blockIndex)}
                      >
                        Remove Block
                      </Button>
                    </div>

                    <Input
                      label="Block Title"
                      labelPlacement="outside"
                      value={block.title}
                      onValueChange={(value) => updateBlock(blockIndex, { title: value })}
                      placeholder="e.g. Warm-Up Prep"
                      isInvalid={!!errors[`blocks.${blockIndex}.title`]}
                      errorMessage={errors[`blocks.${blockIndex}.title`]}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        startContent={<StickyNote className="h-4 w-4" />}
                        onPress={() => toggleNote(blockNoteKey)}
                      >
                        {isBlockNotesExpanded
                          ? "Hide note"
                          : block.notes.trim()
                          ? "Edit note"
                          : "Add note"}
                      </Button>
                    </div>

                    {isBlockNotesExpanded ? (
                      <Textarea
                        label="Block Note"
                        labelPlacement="outside"
                        value={block.notes}
                        onValueChange={(value) => updateBlock(blockIndex, { notes: value })}
                        placeholder="Optional coaching note for this block"
                        minRows={2}
                        classNames={{ inputWrapper: "min-h-unit-14" }}
                      />
                    ) : null}

                    <Divider />

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Drills</p>
                        <p className="text-xs text-default-500">
                          Select existing drills for this block.
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => addDrillToBlock(blockIndex)}
                      >
                        Add Drill
                      </Button>
                    </div>

                    {errors[`blocks.${blockIndex}.drills`] ? (
                      <p className="text-sm text-danger">
                        {errors[`blocks.${blockIndex}.drills`]}
                      </p>
                    ) : null}

                    {availableDrillOptions.length === 0 ? (
                      <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
                        No drills are available for the selected plan discipline.
                      </div>
                    ) : null}

                    {block.drills.length === 0 ? (
                      <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
                        No drills added to this block yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {block.drills.map((drill, drillIndex) => {
                          const drillNoteKey = `drill:${drill.id}`;
                          const isDrillNotesExpanded = Boolean(
                            expandedNoteKeys[drillNoteKey]
                          );

                          return (
                            <Card
                              key={drill.id}
                              shadow="none"
                              className={`border bg-default-50 ${
                                draggingDrill?.blockIndex === blockIndex &&
                                draggingDrill?.drillIndex === drillIndex
                                  ? "opacity-60"
                                  : ""
                              }`}
                              onDragOver={allowDrop}
                              onDrop={() => onDrillDrop(blockIndex, drillIndex)}
                            >
                              <CardBody className="gap-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      draggable
                                      aria-label={`Reorder drill ${drillIndex + 1} in block ${blockIndex + 1}`}
                                      className="rounded-md border border-default-200 p-2 text-default-500 transition hover:bg-default-100"
                                      onDragStart={() =>
                                        setDraggingDrill({ blockIndex, drillIndex })
                                      }
                                      onDragEnd={() => setDraggingDrill(null)}
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </button>
                                    <p className="text-sm font-medium">
                                      Drill {drillIndex + 1}
                                    </p>
                                  </div>
                                  <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() =>
                                      removeDrillFromBlock(blockIndex, drillIndex)
                                    }
                                  >
                                    Remove Drill
                                  </Button>
                                </div>

                                <Select
                                  label="Drill"
                                  labelPlacement="outside"
                                  placeholder="Select a drill"
                                  selectedKeys={drill.drillId ? [drill.drillId] : []}
                                  onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    if (typeof selected === "string") {
                                      const option = availableDrillOptions.find(
                                        (item) => item.id === selected
                                      );
                                      updateDrillInBlock(blockIndex, drillIndex, {
                                        drillId: selected,
                                        title: option?.title ?? "",
                                      });
                                    }
                                  }}
                                  isInvalid={
                                    !!errors[
                                      `blocks.${blockIndex}.drills.${drillIndex}.drillId`
                                    ]
                                  }
                                  errorMessage={
                                    errors[
                                      `blocks.${blockIndex}.drills.${drillIndex}.drillId`
                                    ]
                                  }
                                >
                                  {availableDrillOptions.map((option) => (
                                    <SelectItem key={option.id}>{option.title}</SelectItem>
                                  ))}
                                </Select>

                                <div className="flex flex-wrap items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="light"
                                    startContent={<StickyNote className="h-4 w-4" />}
                                    onPress={() => toggleNote(drillNoteKey)}
                                  >
                                    {isDrillNotesExpanded
                                      ? "Hide note"
                                      : drill.notes.trim()
                                      ? "Edit note"
                                      : "Add note"}
                                  </Button>
                                </div>

                                {isDrillNotesExpanded ? (
                                  <Textarea
                                    label="Drill Note"
                                    labelPlacement="outside"
                                    value={drill.notes}
                                    onValueChange={(value) =>
                                      updateDrillInBlock(blockIndex, drillIndex, {
                                        notes: value,
                                      })
                                    }
                                    placeholder="Optional drill note"
                                    minRows={2}
                                    classNames={{ inputWrapper: "min-h-unit-14" }}
                                  />
                                ) : null}
                              </CardBody>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
